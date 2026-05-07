# SESSION STATE — TI Forgeworks
Last updated: 2026-05-07

---

## Where to Resume

**Next session — two items in order:**
1. **Verify Module 08 OCR behavior** — confirm imports append correctly to existing lots; investigate whether Module 02 seed data persistence is causing unexpected results (see Known Bug #2 below).
2. **Module 01 — Dashboard iframe conversion** — clean up the dashboard and convert it to a persistent iframe shell. Sidebar stays fixed; modules 02–09 load in a content `<iframe>`. Modules require no changes to work inside the iframe.

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/ecstatic-sanderson-3dd1e1` |
| Active PR | https://github.com/fenwig/tmi-crafting-app/pull/new/claude/ecstatic-sanderson-3dd1e1 |

---

## Completed This Session

### Module 08 — OCR Import ✓ COMPLETE
- Live screen capture via `getDisplayMedia()` — Chrome only (file:// origin)
- User drags to select the refinery report region on first run; region saved to `forgex-ocr-region` and auto-applied on subsequent runs; Redefine Region button clears it
- Preprocesses crop: 2× upscale + invert (white-on-dark → black-on-light) for better Tesseract accuracy
- Tesseract.js v4 via CDN — uses `Tesseract.recognize()` simple API (worker API with `setParameters` crashes from file:// due to null WASM reference)
- Parses OCR output: regex matches NAME + two numbers per line; skips header/footer/known keywords
- Results shown in editable table — all fields correctable before import
- Location system mirrors Module 02/03: Levsky default, custom entries, Custom… input, — Edit List — modal, shared `forgex-locations` key
- Accept writes to `forgex-lots` in `{lots, nextId}` format; appends to existing lots

### Module 09 — Data Sync ✓ COMPLETE
- Fetches all ~1,044 blueprints from `api.star-citizen.wiki/api/v2/blueprints` (100/page, ~11 requests)
- Maps `output.type` → Armor / Weapon / Ammunition; skips attachments, ship components, liveries
- Parses armor names: `"Corbel Core Mire"` → base/slot/finish; weight from `output.sub_type`
- Parses weapon names: base + weapon_type from end of name; quoted finish extracted
- Ingredients: `quantity_scu × 100` → cSCU
- Stores to `forgex-blueprints` + `forgex-sync-meta` (date, game version, count)
- UUID-based tracking preservation across re-syncs (owned/tracked flags survive patch-day refresh)
- Live API status check on load; progress log + bar during fetch; results summary after
- Module 04 updated to load from `forgex-blueprints` first, falls back to hardcoded sample data

### forgex_crafting_properties.js ✓ NEW
- Static material→property→formula lookup extracted from game files (p4k, v4.7.2)
- 8 materials mapped: Ouratite, Aslarite, Aluminum, Lindinium, Savrilium, Taranite, Hephaestanite, Iron
- 14 gameplay properties with linear formula: `modifier = modStart + (modEnd-modStart) × clamp((q-qStart)/(qEnd-qStart),0,1)`
- `getMaterialEffects(materialName, quality, weaponType)` helper used by Module 06
- Coverage: all armor weights/categories, all ballistic weapons. Energy weapons pending.

### Module 04 — Blueprint Database ✓ MAJOR UPDATE
**Formatting:**
- Canonical text colors (#ffffff / #d0c4b0 / #90806e) applied
- Font size fixes throughout (14px floor enforced)
- Finish moved into main label text (same Rajdhani, primary color) — no longer a small pill tag
- Ammo hidden from "All" view — only shows when AMMO filter clicked
- "Target Band" → "Target Tier"
- Quality labels: 700+ / 800+ / 900+ throughout (badges, order pills, table headers)
- Tracker legend rewritten per spec

**Workflow — Crafting Tracker tab:**
- Tier badges (700+/800+/900+) start all selected (gold) when blueprint tracked; clickable to dim/reselect
- Tier selection stored in `forgex-tracking` as `tiers:[700,800,900]`
- X button fixed: checks actual `forgex-active-orders` (not stale tracking.order flag) before removing
- Blueprint removed from tracker only when neither personally tracked nor has active order
- FORGE button appears when any selected tier has sufficient materials OR any order is ready
- FORGE writes `forgex-forge-preselect` to localStorage and navigates to Module 06
- Expanded card shows all 3 tier columns per ingredient (700+ / 800+ / 900+) with label + available amount; effective tiers (user-selected + order quality) show amounts, others show `—`
- Order quality tiers auto-included in expanded card even if user hasn't selected them

**Workflow — Material Needs tab:**
- Only aggregates selected tiers per blueprint (not all three by default)
- Inventory loaded fresh from `forgex-lots` on every tab switch

**Data:**
- Inventory loads live from `forgex-lots` (Module 02) — refreshed on every renderTracker/renderNeeds call

### Module 06 — The Forge ✓ UPDATED
- FORGE preselect: reads `forgex-forge-preselect` on init, auto-selects blueprint, switches to Workbench, clears flag
- Blueprints load from `forgex-blueprints` (Data Sync), falls back to hardcoded sample
- ownedIds reads from `forgex-tracking` personal flags (Module 04 live connection)
- Lots read from `forgex-lots`; write back in Module 02's `{lots, nextId}` format
- Quality tier logic: higher-tier materials satisfy lower-tier orders (800+ OK for 700+ order)
- Characteristic + Effect % columns live from `forgex_crafting_properties.js`
- Width 1200px; canonical colors; font size fixes

### Module 03 — Resource Acquisition ✓ FIXED
- `commitAll()` now writes to `forgex-lots` in Module 02's `{lots, nextId}` format (was writing a flat array or nothing)
- `getLocLotCounts()` fixed to handle `{lots, nextId}` object format

### Module 07 — Reports ✓ FIXED
- `loadLots()` fixed to handle Module 02's `{lots, nextId}` object format (was always returning empty)

---

## Known Bugs / Open Items

### VERIFY NEXT SESSION
1. **Module 08 — seed data displacement** — After first OCR import, Module 02 showed only the 5 newly imported lots. Expected cause: Module 02's hardcoded seed lots are in-memory only and never written to `forgex-lots` unless the user makes a change via the UI. OCR import correctly appended to whatever was already in localStorage (nothing). Verify this is the full explanation and no real data was lost. If seed data persistence is desired, Module 02 should write seed data to localStorage on first load when the key is absent.

### NOTED — Project-wide
2. **Game dates in seed data** — Modules 02 and 05 seed data uses `2954-XX-XX` game dates. Invisible in date-filtered report views. Needs cleanup.
3. **Module 05 — qty field on orders** — `qty` field to be removed (one crafted item per order). Deferred.
4. **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic weapons only. Laser/plasma/electron weapon materials not yet extracted from game files.
5. **Module 04 toggleOwned() persistence** — Reported fixed by user; tabled for now. Verify if reports show owned state correctly.

### RESOLVED THIS SESSION
- ~~forgex-lots format mismatch~~ ✓ — Module 02 stores `{lots, nextId}` object; Modules 03/04/06/07 all expected flat array. All four fixed to handle both formats; writes now use Module 02's format.
- ~~Module 03 → 02 not connected~~ ✓ — commitAll() now writes to forgex-lots correctly
- ~~Module 06 ownedIds hardcoded~~ ✓ — reads from forgex-tracking
- ~~Module 07 loadLots empty~~ ✓ — format mismatch fixed
- ~~Module 06 quality tier exact-match~~ ✓ — higher tier satisfies lower order requirement

---

## File Inventory

| File | Status |
|---|---|
| `forgex_module01_dashboard_v4.html` | ✓ Done — OLD text colors |
| `forgex_module02_materials_v2.html` | ✓ Done — fully updated |
| `forgex_module03_acquisition.html` | ✓ Done — commitAll fixed, format fixed |
| `forgex_module04_v2_full.html` | ✓ Done — major update this session; OWNED persistence still needed |
| `forgex_module05_orders.html` | ✓ Done — NEW text colors |
| `forgex_module06_crafting.html` | ✓ Done — fully wired, FORGE preselect, crafting properties |
| `forgex_crafting_properties.js` | ✓ Done — static material→property→formula (v4.7.2) |
| `forgex_module07_reports.html` | ✓ Done — loadLots format fixed |
| `forgex_module08_ocr.html` | ✓ Done — OCR import, location system, editable results table |
| `forgex_module09_datasync.html` | ✓ Done — first build |
| `forgexcontext 1.md` | ✓ Updated this session |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo |
| `small logo.png` | Header corner logo |

---

## localStorage Key Reference

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots:[...], nextId:N}` | **Object, not flat array.** All readers must handle this. |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array. Falls back to hardcoded in Modules 04/06. |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers}}` | personal+order booleans; tiers = number[] |
| `forgex-active-orders` | Module 05 | `Order[]` | Active (non-delivered) orders |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last Data Sync metadata |
| `forgex-locations` | Module 02/03 | `string[]` | Custom location names |
| `forgex-forge-preselect` | Module 04 | `string` (bpId) | One-time flag; cleared by Module 06 on load |

---

## Conventions (Full Reference)

| Rule | Detail |
|---|---|
| Confirm before coding | Always present plan, wait for explicit "go" |
| No AskUserQuestion tool | Ask questions as plain text |
| Header pattern | Eyebrow: org name / Title: module name (white, Rajdhani) |
| Page width | **1200px** max-width |
| Min font size | **14px** floor (exceptions: badges/pills 9–11px, eyebrow 10px) |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Quality tier labels | **700+ / 800+ / 900+** (not 700s/800s/900s) |
| Quality tier colors | <500 dim / 500–699 secondary / 700–799 gold / 800–899 brighter gold / 900+ green (#5a9955) |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) |
| forgex-lots format | Always `{lots:[...], nextId:N}` — never write a flat array |
| Ammo in browser | Hidden from "All" view — only shows when AMMO filter active |
| No ammo in reports | Exclude type:'Ammunition' from all reports |
| Hand-mined | Read-only indicator badge, never a toggle |
| Locations | Shared via `forgex-locations` localStorage |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 07" etc. |
| Flavor text | Add in a single pass at the end, after structure is confirmed |

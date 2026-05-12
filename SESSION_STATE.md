# SESSION STATE — TI Forgeworks
Last updated: 2026-05-12

---

## Where to Resume

**Next session:** No outstanding build tasks. All 10 modules online and feature-complete. Order fulfillment workflow complete and tested. User will direct next priorities.

**Outstanding action items:** None. All maintenance tasks complete.

**This session notes (2026-05-12 bug fixes & UX refinement):**
- **CRITICAL FIX:** Removed conflicting order status update block in Module 06 makeItem() that was setting status='ready' (invalid) instead of 'readytodeliver', causing crafted orders to disappear entirely
- **Module 05:** Added blueprint search with "BLUEPRINT KEYWORD" placeholder; filter out all ammunition blueprints; sort blueprints alphabetically
- **Module 06:** Redesigned ORDER FULFILLMENT display with customer name and quality on separate lines; standardized font size to 14px
- **Module 09 Data Sync:** Re-sync performed — `forgex-blueprints` rebuilt with corrected gem ingredient quantities
- All changes tested and committed. Order fulfillment workflow fully functional. All modules operational.

**Previous session (2026-05-08 final push):**
- Module 10 Codex created with full documentation coverage
- Module 02 major refactor: location filter, BP panel, delete confirmation, stats conversion
- Default location system implemented globally (localStorage-based, synced across Modules 02/03/08)
- Module 03 queue height doubled
- All modules tested and working. Ready for distribution.

---

## Repository & Workflow

| Field | Value |
|---|---|
| Live folder | `D:\Support Files\Crafting App\` |
| Version control | Local git only — GitHub remote removed |
| Claude workflow | Edit files directly in live folder (no worktrees/PRs) |
| Distribution tag | `distributed` — marks last sent version |

---

## Completed This Session (2026-05-08)

### Ore / Gem List — All Modules ✓ FIXED
- Canonical 27-ore list established across Modules 02, 03, 08
- Removed: `diamond`, `inertite`
- Fixed spelling: `quantanium` → `quantainium`
- Added ores: `hephaestanite`, `ice`, `ouratite`, `riccite`, `savrilium`, `tin`, `torite`
- `dolivine` confirmed as a **gem** (not ore) — moved out of ALL_ORES and into GEM_NAMES/ALL_GEMS
- `dolvine` (wrong spelling) → `dolivine` fixed in GEM_NAMES across all modules 02–08
- Module 08 KNOWN_ORES: `dolivine` removed from refined ores, `dolvine` → `dolivine` in gems section

### Gem Units — All Modules ✓ FIXED
- Gems are tracked as individual **gem counts**, not cSCU
- Module 02: gem lots display "GEMS" unit; Add Lot form label switches to "Quantity (gems)" dynamically
- Module 03: queue display shows "gems" for hand-mined items; error message updated
- Module 04: ingredient list and tracker detail rows show "gems" for gem ingredients
- Module 06: workbench slot requirements, selected lots, lot picker all show "gems"
- Module 09: ingredient qty for gems now uses `ing.quantity` (game count) when `quantity_scu` is null — **re-sync required**

### Module 07 — Reports ✓ OVERHAULED
- Crafting Availability (Report 2): replaced hardcoded 10-blueprint array with `loadBlueprints()` from `forgex-blueprints`
- Fixed `getOwnedBpIds()` to read from `forgex-owned` (was reading `forgex-tracking.personal` — showed nothing)
- Report 2 rebuilt: Armor / Weapons toggle in filter bar; armor grouped by set with slot pills; quality determined by Core piece; weapons listed individually
- `SLOT_ORDER` corrected to `Helmet → Core → Legs → Arms → Backpack`
- Owned Blueprints (Report 3): same `forgex-owned` fix applied

### Module 04 — Blueprint Database ✓ FIXED
- Material Needs defaults to "All" tiers (was defaulting to 700+)
- Material Needs list now sorted alphabetically
- Ingredient display shows "gems" for gem ingredients
- Tracker detail rows show "gems" for gem ingredients

### Module 10 — Codex (In-App Documentation) ✓ CREATED
- New module with 9 collapsible sections (one per Module 1–9)
- Anchor nav bar with jump links (Dashboard, Materials, Acquisition, Blueprints, The Forge, Orders, Reports, OCR Import, Data Sync)
- Full draft documentation for all major workflows
- Toggle / scroll-to JS functions implemented
- Integration: Dashboard nav activated + card status updated to "Online"

### Module 02 — Material Database ✓ MAJOR REFACTOR
- **Location filter:** Replaced sort button with dropdown filter (All vs. specific location)
- **Blueprint panel:** New modal showing owned blueprints containing selected ore as ingredient
- **Delete confirmation:** 2-click pattern (DEL → OK/✕ buttons, prevents accidental deletions)
- **Stats bar:** Simplified display — Gems (count) / Ore SCU (cSCU converted to SCU, labeled "Ore SCU")
- **Search:** Removed location from search logic (now location-only filter dimension)
- **SCU display:** Removed `(X.XX SCU)` label from ore quantity column
- **Default location system:** Global localStorage-based default location, synced across Modules 02/03/08

### Module 03 — Acquisition ✓ UPDATED
- **Queue height:** Doubled from 280px to 560px max-height (accommodates more items)
- **Default location system:** Integrated global localStorage default location with pre-selection in Add Item form
- Module init: dropdown pre-selects DEFAULT_LOC on form open

### Module 08 — OCR Import ✓ UPDATED
- **Default location system:** Integrated global localStorage default location with pre-selection
- **Documentation:** Updated in Codex with OCR auto-correct indicators table (~ = fuzzy match, ? = no match, silent = exact)
- Module init: dropdown pre-selects DEFAULT_LOC on form open

### Module 01 — Dashboard ✓ ACTIVATED CODEX
- Removed `dim` class from Codex nav button
- Added `onclick="loadModule('forgex_module10_codex.html','codex')"` to activate module
- Updated Codex card: `coming-soon` → `ready` class
- Status dot: `pending` → `ready`, label: "IN DEVELOPMENT" → "ONLINE"
- Added `'forgex_module10_codex.html': 'codex'` to postMessage navKeys map

### Default Location System Architecture ✓ IMPLEMENTED
- **localStorage key:** `forgex-default-location` (shared across Modules 02, 03, 08)
- **Fallback:** `FALLBACK_LOC = 'Levsky'` (built-in, always available)
- **User default:** `DEFAULT_LOC = localStorage.getItem(DEFAULT_LOC_KEY) || FALLBACK_LOC`
- **Edit UI:** Shows DEFAULT badge on current default; "Set Default" button for others; Remove button only on custom locations
- **Sync on change:** All dropdowns rebuild and re-select when default is changed
- **Init fix:** All Add/Edit forms now explicitly set dropdown `.value = DEFAULT_LOC` after calling `buildLocOptions()`

---

## Completed Previous Sessions

### Import/Export ✓ VERIFIED
- User tested backup/restore via incognito window — confirmed working
- 811 blueprints confirmed correct (233 skipped = intentionally filtered types)

### Module 05 — Orders ✓ FULLY WIRED
- Blueprints, inventory, and orders all load from localStorage on init

### Module 06 — The Forge ✓ CLEANED
- Stale dev notice banner and CSS removed

### Module 09 — Data Sync ✓ EXTENDED
- `meta: {}` bag on every blueprint record
- Sync log persists up to 20 entries with skipped-type breakdown

### Distribution Workflow ✓ BUILT
- `Collect Updates.ps1` / `Clear Updates.ps1` confirmed working
- Friends only need the 12 app files

---

## Known Bugs / Open Items

### NOTED — Project-wide
1. **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic weapons only. Laser/plasma/electron weapon materials not yet extracted from game files.
2. **Skipped blueprint types** — 233 records filtered out each sync (weapon attachments, ship components, liveries, etc.). Review when new craftable types ship.
3. **Past Orders not persisted** — delivered orders lost on page reload. Deferred — low priority.
4. **Module 06 owned IDs** — still reads from `forgex-tracking.personal` instead of `forgex-owned`. Does not affect crafting but browser tab may show wrong blueprints.

### RESOLVED THIS SESSION (2026-05-12)
- ~~Crafted items disappearing from orders view~~ ✓ — order status being set to invalid 'ready' instead of 'readytodeliver'; removed conflicting status update block in Module 06 makeItem()

### RESOLVED PREVIOUS SESSION (2026-05-08 & earlier)
- ~~Crafting Availability showing nothing~~ ✓ — was using hardcoded blueprints + wrong owned key
- ~~Owned Blueprints showing nothing~~ ✓ — `getOwnedBpIds()` now reads `forgex-owned`
- ~~Material Needs defaulting to 700+~~ ✓ — now defaults to All
- ~~Material Needs not sorted~~ ✓ — now alphabetical
- ~~Gem quantities stored as 0 in blueprints~~ ✓ — Module 09 now uses `ing.quantity` for gems
- ~~Gems showing cSCU unit~~ ✓ — all modules now show "gems" for hand-mined ingredients
- ~~dolvine/dolivine spelling mismatch~~ ✓ — fixed across all 7 modules
- ~~dolivine in ore list~~ ✓ — moved to gems where it belongs

---

## File Inventory

| File | Status |
|---|---|
| `forgex_module01_dashboard_v4.html` | ✓ Done |
| `forgex_module02_materials_v2.html` | ✓ Done |
| `forgex_module03_acquisition.html` | ✓ Done |
| `forgex_module04_v2_full.html` | ✓ Done |
| `forgex_module05_orders.html` | ✓ Done |
| `forgex_module06_crafting.html` | ✓ Done — note: owned IDs bug (see Known Bugs #4) |
| `forgex_crafting_properties.js` | ✓ Done — ballistic only; energy weapons pending |
| `forgex_module07_reports.html` | ✓ Done — Reports 2 & 3 overhauled this session |
| `forgex_module08_ocr.html` | ✓ Done |
| `forgex_module09_datasync.html` | ✓ Done — gem qty fix this session; re-sync required |
| `forgex_module10_codex.html` | ✓ Done — In-app documentation with collapsible sections |
| `forgexcontext 1.md` | ✓ Current |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo |
| `small logo.png` | Header corner logo |
| `Collect Updates.ps1` | Distribution script — collects changed app files |
| `Clear Updates.ps1` | Distribution script — clears folder, advances baseline tag |
| `Updates to be sent\` | Staging folder for friend distribution |

---

## localStorage Key Reference

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots:[...], nextId:N}` | **Object, not flat array.** All readers must handle this. |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array. Modules 04/05/06/07 all load from here. |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers}}` | personal+order booleans; tiers = number[] |
| `forgex-owned` | Module 04 | `number[]` | Owned blueprint IDs — independent of tracking |
| `forgex-active-orders` | Module 05 | `Order[]` | Active (non-delivered) orders only |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last Data Sync metadata |
| `forgex-sync-log` | Module 09 | `SyncEntry[]` | Up to 20 sync history entries with skipped-type breakdown |
| `forgex-locations` | Module 02/03/08 | `string[]` | Custom location names |
| `forgex-default-location` | Module 02/03/08 | `string` | Current default location (Levsky if not set); shared global default |
| `forgex-forge-preselect` | Module 04 | `string` (bpId) | One-time flag; cleared by Module 06 on load |

---

## Conventions (Full Reference)

| Rule | Detail |
|---|---|
| Confirm before coding | Always present plan, wait for explicit "go" |
| No AskUserQuestion tool | Ask questions as plain text |
| Header pattern | Eyebrow: **TI Forgeworks — Custom Arms & Armor** / Title: module name (white, Rajdhani) — ✓ applied to all modules |
| Page width | **1200px** max-width |
| Min font size | **14px** floor (exceptions: badges/pills 9–11px, eyebrow 10px) |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Quality tier labels | **700+ / 800+ / 900+** (not 700s/800s/900s) |
| Quality tier colors | <500 dim / 500–699 secondary / 700–799 gold / 800–899 brighter gold / 900+ green (#5a9955) |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) |
| forgex-lots format | Always `{lots:[...], nextId:N}` — never write a flat array |
| Gem quantities | Stored and displayed as individual gem counts (not cSCU). Blueprint ingredients use `ing.quantity` from API when `quantity_scu` is null. |
| Ammo in browser | Hidden from "All" view — only shows when AMMO filter active |
| No ammo in reports | Exclude type:'Ammunition' from all reports |
| Hand-mined | Read-only indicator badge, never a toggle |
| Locations | Shared via `forgex-locations` localStorage |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 07" etc. |
| Future blueprint types | Park type-specific API fields in `meta: {}` on the blueprint record |
| Flavor text | Add in a single pass at the end, after structure is confirmed |

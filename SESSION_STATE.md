# SESSION STATE — TI Forgeworks
Last updated: 2026-05-06

---

## Where to Resume

Module 07 (Reports) is complete for now. Start next session on **Module 08 — OCR Import** (`forgex_module08_ocr.html`). OCR input form that feeds material lots into Module 02's `forgex-lots` localStorage key.

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/ecstatic-sanderson-3dd1e1` |
| Active PR | https://github.com/fenwig/tmi-crafting-app/pull/new/claude/ecstatic-sanderson-3dd1e1 |

---

## Completed This Session

### Module 02 — Material Database ✓ UPDATED
- localStorage persistence via `forgex-lots`; seeds sample data on first load
- Custom locations saved to `forgex-locations` and repopulated in all dropdowns
- COMBINE / SPLIT / MOVE lot operations with confirmation modals
- COMBINE blocked for mixed ores or different locations
- Row checkboxes at end of row; select-all header toggle
- Ore/Gem filter toggle in Add Lot form (All / Gems / Ore)
- Hand-mined indicator replaces toggle — auto-set from ore selection
- 5-tier quality color ramp; 900+ is green
- Smart button gating: Combine requires 2+ same ore + same location; Move requires 1+ same location
- Footer shows visible total cSCU/SCU; selected state shows count + total cSCU
- Edit List for shared location management — modal shows lot counts, blocks removal if in use
- 1200px width; canonical text colors

### Module 03 — Resource Acquisition ✓ UPDATED
- Canonical text colors and 1200px width
- All / Gems / Ore filter toggle above material dropdown
- Hand-mined indicator replaces toggle
- Entry placeholder updated to "press enter to add"
- Removed format hint, removed SESSION ACTIVE badge
- Shared `forgex-locations` storage integrated
- Edit List modal (same as Module 02)

### Module 07 — Reports ✓ COMPLETE (first build)
Five-tab report suite:
- **Report 1 — Materials Available**: Ore vs Gems columns, 700+/800+/900+ quality bands, date range filter
- **Report 2 — Crafting Availability**: Owned BPs only, availability check per quality band, omits uncraftable BPs
- **Report 3 — Owned Blueprints**: Armor grouped by base+finish with slots listed; weapons as base+finish+weapon_type
- **Report 4 — Orders Filled**: Delivered orders, customer name, quality tier, date; date range filter
- **Report 5 — Crafted Items**: Quality tier band, Crafted Impact column (pending game data), date range filter
- Logo in header and each report brand strip
- Print/Save PDF via browser print; Copy as Text via clipboard
- Game dates (year > 2100) excluded from date-filtered views

---

## Known Bugs / Open Items

### HIGH — Fix next opportunity
1. **Demeco tracking bug** — Blueprints marked as owned in Module 04 (via `forgex-tracking`) are not appearing in Module 07 Reports 2 and 3. Confirmed not a materials issue. Need to inspect what Module 04 actually writes to `forgex-tracking` vs what Module 07 reads. Likely a localStorage isolation issue if modules are opened in separate browser contexts.

2. **Module 03 → 02 not connected** — "Commit to Inventory" in Module 03 shows a toast but does NOT write to `forgex-lots`. Lots entered in acquisition never land in the material database.

3. **Module 06 ownedIds hardcoded** — Module 06 (The Forge) uses a hardcoded `ownedIds` Set instead of reading from `forgex-tracking`. Owned status set in Module 04 has no effect on what The Forge considers craftable.

### NOTED — Project-wide
4. **Quality tier naming** — All modules should use 700+/800+/900+ (not 700s/800s/900s). Module 07 updated; Modules 02, 04, 05, 06 still use old notation.

5. **Game dates in seed data** — Modules 02 and 05 seed data uses `2954-XX-XX` game dates. These are invisible in date-filtered report views. Needs cleanup.

6. **Module 06 → 04 connection** — Module 06 should read owned blueprints from `forgex-tracking` (Module 04) rather than hardcoded set.

7. **Module 05 — qty field on orders** — `qty` field to be removed (one crafted item per order). Deferred.

---

## File Inventory

| File | Status |
|---|---|
| `forgex_module01_dashboard_v4.html` | ✓ Done — OLD text colors |
| `forgex_module02_materials_v2.html` | ✓ Done — NEW, fully updated |
| `forgex_module03_acquisition.html` | ✓ Done — NEW, fully updated |
| `forgex_module04_v2_full.html` | ✓ Done — OLD text colors |
| `forgex_module05_orders.html` | ✓ Done — NEW text colors |
| `forgex_module06_crafting.html` | ✓ Done — NEW text colors |
| `forgex_module07_reports.html` | ✓ Done — NEW, first build |
| `forgex_module08_ocr.html` | ⬜ Not started |
| `forgex_module09_datasync.html` | ⬜ Not started |
| `forgexcontext 1.md` | needs update |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo |
| `small logo.png` | Header corner logo |

---

## Conventions (Full Reference)

| Rule | Detail |
|---|---|
| Confirm before coding | Always present plan, wait for explicit "go" |
| No AskUserQuestion tool | Ask questions as plain text |
| Header pattern | Eyebrow: org name / Title: module name (white, Rajdhani) |
| Page width | **1200px** max-width |
| Min font size | **14px** floor |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Quality tier labels | **700+ / 800+ / 900+** (not 700s/800s/900s) |
| Quality tier colors | <500 dim / 500–699 secondary / 700–799 gold / 800–899 brighter gold / 900+ green (#5a9955) |
| Blueprint labels | `Base Slot Finish Armor` / `Base Finish WeaponType` |
| No ammo in reports | Exclude type:'Ammunition' from all reports |
| Hand-mined | Read-only indicator badge, never a toggle |
| Locations | Shared via `forgex-locations` localStorage |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 07" etc. |
| Commit & push | After each logical chunk |
| Flavor text | Add in a single pass at the end, after structure is confirmed |

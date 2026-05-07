# SESSION STATE — TI Forgeworks
Last updated: 2026-05-07

---

## Where to Resume

**Next session:** Run a fresh Data Sync to populate `forgex-sync-log` and review the skipped-type breakdown. No outstanding build tasks. User will direct based on findings.

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/focused-mendel-7e5577` |

---

## Completed This Session

### Import/Export ✓ VERIFIED
- User tested backup/restore via incognito window — confirmed working
- 811 blueprints confirmed correct (233 skipped = intentionally filtered types)

### Module 05 — Orders ✓ FULLY WIRED
- Blueprints now load from `forgex-blueprints` (was hardcoded to 10 items)
- Inventory now loads from `forgex-lots` (was hardcoded placeholder data)
- Orders now load from `forgex-active-orders` on init (was always starting from seed data and overwriting localStorage)
- `nextId` derived from max loaded order ID (was hardcoded to 5)
- `writeActiveOrders()` removed from `init()` — no longer overwrites real data on load

### Module 06 — The Forge ✓ CLEANED
- Stale dev notice banner removed ("owned blueprint list is hardcoded Set" — was fixed sessions ago)
- CSS for `.dev-notice` also removed

### Module 09 — Data Sync ✓ EXTENDED
- `meta: {}` bag added to every blueprint record — future blueprint types (ship components, weapon attachments, etc.) will park type-specific attributes here
- Sync now tracks skipped records by `output.type` name with counts
- Persistent sync log: stores up to 20 entries in `forgex-sync-log`; shown on Data Sync page with date, counts, breakdown by type, and skipped-type detail
- `renderSyncLog()` called on page load — log persists across sessions

### Architecture Decision — Future Blueprint Types
- Agreed: add `meta: {}` now (done), hold Module 04 filter/display overhaul until a real new type ships
- When new types arrive: extend `resolveType()` in Module 09 and park type-specific API fields in `meta`

---

## Known Bugs / Open Items

### NOTED — Project-wide
1. **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic weapons only. Laser/plasma/electron weapon materials not yet extracted from game files.
2. **Skipped blueprint types** — 233 records filtered out each sync (weapon attachments, ship components, liveries, etc.). Run a sync to see the full breakdown in the new Sync History log. Review when new craftable types ship.
3. **Past Orders not persisted** — `forgex-active-orders` stores only non-delivered orders. Delivered orders exist in memory for the session but are lost on reload. Past Orders tab will be empty after refresh. Deferred — low priority.

### RESOLVED THIS SESSION
- ~~Module 05 orders overwriting localStorage~~ ✓ — loads from forgex-active-orders on init
- ~~Module 05 inventory hardcoded~~ ✓ — loads from forgex-lots
- ~~Module 05 blueprint dropdown hardcoded~~ ✓ — loads from forgex-blueprints
- ~~Module 06 stale dev notice~~ ✓ — removed
- ~~Game dates in seed data~~ ✓ CLOSED — seed data is fallback only; all new records use real dates via `new Date()`
- ~~811 vs 1044 blueprint count~~ ✓ CLOSED — 811 is correct; 233 are intentionally filtered non-craftable types

---

## File Inventory

| File | Status |
|---|---|
| `forgex_module01_dashboard_v4.html` | ✓ Done |
| `forgex_module02_materials_v2.html` | ✓ Done |
| `forgex_module03_acquisition.html` | ✓ Done |
| `forgex_module04_v2_full.html` | ✓ Done |
| `forgex_module05_orders.html` | ✓ Done — fully wired to localStorage this session |
| `forgex_module06_crafting.html` | ✓ Done — dev notice removed |
| `forgex_crafting_properties.js` | ✓ Done — ballistic only; energy weapons pending |
| `forgex_module07_reports.html` | ✓ Done |
| `forgex_module08_ocr.html` | ✓ Done |
| `forgex_module09_datasync.html` | ✓ Done — meta bag, skipped-type tracking, sync log |
| `forgexcontext 1.md` | ✓ Current |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo |
| `small logo.png` | Header corner logo |

---

## localStorage Key Reference

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots:[...], nextId:N}` | **Object, not flat array.** All readers must handle this. |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array. Modules 04/05/06 all load from here. |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers}}` | personal+order booleans; tiers = number[] |
| `forgex-active-orders` | Module 05 | `Order[]` | Active (non-delivered) orders only |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last Data Sync metadata |
| `forgex-sync-log` | Module 09 | `SyncEntry[]` | Up to 20 sync history entries with skipped-type breakdown |
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
| Future blueprint types | Park type-specific API fields in `meta: {}` on the blueprint record |
| Flavor text | Add in a single pass at the end, after structure is confirmed |

# SESSION STATE — TI Forgeworks
Last updated: 2026-05-06
Last updated: 2026-05-05

---

## Where to Resume

Module 06 (The Forge) is complete. Module lineup confirmed: 07 = Reports, 08 = OCR Import, 09 = Data Sync / API. Start next session by planning Module 07 — Reports.
Session ended after completing Module 05 refinements. User mentioned a **"big module coming up"** — likely Module 06 (Crafting Tracker). Start a fresh conversation, read this file and `forgexcontext 1.md`, then ask: *"Ready for the next module — want to start with Module 06?"*

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/loving-villani-121981` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/3 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\loving-villani-121981` |
| Branch | `claude/charming-antonelli-f38c9f` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/1 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\charming-antonelli-f38c9f` |
| Last commit | `d03203c` — Module 05 white text scheme, 14px floor, blueprint labels, readiness fix |

---

## What Was Completed This Session

### Module 06 — The Forge ✓ COMPLETE

**Three-tab layout:**

**Tab 1 — Blueprint Browser**
- Full-width search input
- Filter bar: All / Armor / Weapon / Ammo / (divider) / Tracked / Orders
- Tracked filter: shows blueprints where `forgex-tracking[id].personal === true`
- Orders filter: shows blueprints where `forgex-tracking[id].order === true`
- ★ TRACKED and ★ ORDER badges shown on cards when applicable
- Owned blueprints only; expandable ingredient list
- `CRAFT THIS` button → loads blueprint into workbench and switches to Workbench tab

**Tab 2 — Craft Workbench**
- Blueprint info bar with `← Change Blueprint` button
- Order Fulfillment (Approach 1): attach order before crafting; shows target tier badge; MAKE ITEM blocked only if order attached AND tier mismatches
- Ingredient slots: ADD LOT opens lot picker sorted high→low (toggle); REMOVE LAST is LIFO
- Quality tier calculated from weighted avg of non-aslarite ingredients only
- MAKE ITEM: deducts inventory, removes zero-qty lots, clears slot selections, keeps blueprint loaded, shows inline result
- Inline result: CRAFTED badge, item name, tier, material quality table with characteristic/effect stubs ("pending game data")
- View Log button routes to Crafting Log tab

**Tab 3 — Crafting Log**
- Persistent via `forgex-crafting-log` localStorage
- Filter: All / Personal / Orders
- Expandable row detail: full material breakdown with characteristic/effect stubs
- ATTACH ORDER button on unlinked entries → marks order READY
- DETACH ORDER button on linked entries → reverts order to In Progress

**Post-craft behavior:**
- Materials deducted from in-memory inventory; zero-qty lots removed
- Slot selections cleared; same blueprint stays loaded; result shows inline
- No "Craft Another" button — user selects new blueprint from Browser tab if needed

**Sample blueprint added:** Corbel Arms Mire (id:11, Armor, Combat, finish:'Mire', same ingredients as Corbel Arms)

**Bugs fixed this session:**
- CRAFT THIS button was broken — `selectBlueprint()` referenced removed `result-panel` element, causing null reference that silently killed the function
- Title "The Forge" corrected to white (`--tmi-text-primary`) instead of gold
- Tag line redundancy fixed — armor shows category only, weapons show "Weapon", ammo shows "Ammo · WeaponType"
- 14px font floor and canonical colors applied throughout Module 06

---

## Unresolved Issues (carried forward)

1. **Text color inconsistency** — Modules 01–04 still use old dim text scheme. Modules 05 and 06 are on canonical white (`#ffffff / #d0c4b0 / #90806e`). Apply on next edit of each.
2. **Blueprint data out of sync** — Module 05 blueprint list is a manual copy of Module 04's. Mirror manually until API import built.
3. **Data persistence** — Lots, orders, and blueprint owned/tracking state reset on page refresh. Only `forgex-crafting-log`, `forgex-tracking`, and `forgex-active-orders` persist. Modules 02, 04, 05 need localStorage retrofit.
4. **Module 04 ORDER pill border class** — `.has-order` / `.has-both` may conflict visually with bp-card layout. Check on next Module 04 edit.
5. **Module 05 qty field** — `qty` on Order to be removed (one crafted item per order). Deferred.
6. **ownedIds not persisted** — Module 06 has a hardcoded `ownedIds` Set that should eventually sync with Module 04's owned state via localStorage.
### Module 01 — Command Dashboard
- New transparent PNG logos embedded (`large logo.png`, `small logo.png`)
- Title → "TI Forgeworks" / "Craft Tracker Suite"
- Removed "System Nominal" status pill
- Rebuilt module grid: 6 cards with correct href links
- Removed Resource Acquisition and Data Sync cards
- Removed all Module number references
- Stats bar: replaced Material Lots with Completed Orders
- Eyebrow → org name

### Module 02 — Material Database
- 960px max-width
- Notes column removed entirely
- sr-only h2 removed
- Eyebrow → org name; Title → "Material Database"
- Text colors: primary #e8e0d0, secondary #b0a890, dim #6a6050 ⚠️ OLD SCHEME — needs update

### Module 03 — Resource Acquisition
- 960px max-width
- sr-only h2 removed; eyebrow → org name
- Text colors and font sizes matched Module 02 ⚠️ OLD SCHEME — needs update

### Module 04 — Blueprint Database
- 1200px max-width
- sr-only h2 removed; eyebrow → org name
- Multi-row context-sensitive filter bar (Type / Category / Slot / Weight / Weapon Type / Finish search)
- Blueprint schema: `weight` and `finish` fields added; 4 additional sample blueprints
- Card labels: bold shows `base+slot` (armor), `base+weapon_type` (weapon), `base+ammo_type` (ammo)
- Tag strip: finish → category (no slot repetition)
- TRACK button = personal-only toggle; ORDER badge = read-only pill set by Module 05
- **Crafting Tracker redesigned** to match browser card style:
  - `★ TRACKED` gold badge + 700/800/900 readiness bands (personal)
  - ORDER pills per quality tier — turn green when materials sufficient for full order qty
  - Single card per blueprint — no duplication
  - ✕ only removes personal; order-tracked stays until order fulfilled
- Material Needs tab font/color consistency
- Text colors: old scheme ⚠️ OLD SCHEME — needs update

### Module 05 — Order Tracker ✓ FULLY UP TO DATE
- 1200px max-width
- Eyebrow → org name ✓
- **NEW canonical text colors: #ffffff / #d0c4b0 / #90806e**
- All font sizes at 14px minimum throughout all three tabs
- **Pipeline simplified:** Queued removed → In Progress → Ready → Delivered
- New orders start at In Progress
- Blueprint data matches Module 04 schema (base, slot, weight, finish, weapon_type, ammo_type)
- `getBpLabel()` helper: dropdown + order display shows "Aztalan Arms Nightfall" format
- Delete Order moved to expanded detail with two-step confirmation
- Revert button: steps order back one status; reverting Delivered re-syncs localStorage
- Past Orders tab shows Revert so accidental deliveries can be undone
- Readiness in detail shows only ordered quality tier (not all three)
- "Quality Target" → "Quality Tier"

### Cross-Module Integration (04 ↔ 05)
- `forgex-tracking` — `{ [bpId]: { personal, order } }` written by both modules
- `forgex-active-orders` — active orders array written by Module 05, read by Module 04
- Material Needs splits needs by quality band (personal = all bands, orders = specific band)

### Documentation
- `forgexcontext 1.md` — updated with schemas, canonical text colors, 14px rule, TODOs
- `SESSION_STATE.md` — this file

---

## Unresolved Issues

1. **Text color scheme inconsistency** — Modules 01, 02, 03, 04 still use the OLD text color values (`#e8e0d0 / #b0a890 / #6a6050`). Module 05 is the only one on the new canonical white scheme (`#ffffff / #d0c4b0 / #90806e`). Must update all modules to match when next editing them.

2. **Module 04 ORDER pill border class** — tracker rows use `.has-order` / `.has-both` CSS classes inherited from old design. These may conflict visually with the new bp-card layout used by the tracker. Check rendering on next Module 04 edit.

3. **Data persistence** — all module data (lots, orders, blueprints owned/tracked) resets on page refresh. Only cross-module tracking state persists via localStorage. Full localStorage persistence not yet implemented.

4. **Blueprint data out of sync** — Module 05's blueprint list is a manual copy of Module 04's. Any new blueprints added to Module 04 must be manually mirrored to Module 05 until the SC Wiki API import is built.

---

## Outstanding TODOs

### Immediate — next session
- [ ] **Apply canonical text colors to Modules 01, 02, 03, 04** on next edit
- [ ] **Plan and build Module 07 — Reports** (`forgex_module07_reports.html`)

### Module 06 — Near-term
- [ ] Wire up real game formula data when SC Wiki API is available (characteristic + effect % per material)
- [ ] Persist `ownedIds` to localStorage so Module 06 stays in sync with Module 04 owned state

### Near-term
- [ ] Build **Module 08 — OCR Import** (`forgex_module08_ocr.html`)
- [ ] Build **Module 09 — Data Sync** (`forgex_module09_datasync.html`)
- [ ] Wire up **iframe shell** in Module 01
- [ ] **Remove `qty` from Order form in Module 05**

### Data & Persistence ⚠️ ALL MODULE DATA MUST PERSIST
- [ ] Persist material lots to localStorage (Module 02)
- [ ] Persist orders across sessions (Module 05)
- [ ] Persist blueprint owned/tracking state (Module 04)
- [ ] **Lot combination** — merge two lots: sum qty, average quality
- [ ] **Apply canonical text colors to Modules 01, 02, 03, 04** (`#ffffff / #d0c4b0 / #90806e`) on next edit
- [ ] **Build Module 06 — Crafting Tracker** (`forgex_module06_crafting.html`) — user indicated this is the "big module coming up"

### Near-term
- [ ] Build Module 07 — The Forge (`forgex_module07_forge.html`)
- [ ] Build Module 08 — Reports (`forgex_module08_reports.html`)
- [ ] iframe shell — Module 01 becomes persistent frame with sidebar; modules load in content pane

### Data & Persistence
- [ ] Persist material lots to localStorage (Module 02)
- [ ] Persist orders across sessions (Module 05)
- [ ] Persist blueprint owned/tracking state (Module 04)
- [ ] Lot combination feature: merge two lots → sum qty, average quality

### Future
- [ ] SC Wiki API import (`https://api.star-citizen.wiki/blueprints`) for blueprint data
- [ ] Ship components in blueprint list (Type / Class / Tier / Size)
- [ ] OCR ore import (Module 03 currently manual entry only)

---

## User Preferences & Conventions (Full Reference)

| Rule | Detail |
|---|---|
| Confirm before coding | Always present plan, wait for explicit "go" or "proceed" |
| No AskUserQuestion tool | Ask questions as plain text only |
| Header pattern | Eyebrow: org name (small, gold-dim) / Title: module name (large, Rajdhani, **white**) |
| Page width | **960px** max-width |
| Min font size | **14px** floor for all functional/readable text; badges/pills/eyebrows intentionally smaller |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base AmmoType` (ammo) |
| Blueprint tags | Category only (armor) / "Weapon" (weapon) / "Ammo · WeaponType" (ammo) — no redundant slot/type |
| Finish not color | Stylistic name of blueprint called "finish" (e.g. "Mire", "Necropolis") |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 06" etc. to user |
| Commit & push | After each logical chunk |
| PR | Open a new PR per branch — PR #3 is current |
| Confirm before coding | Always present plan, wait for explicit "go" |
| Receive all feedback first | User gives multiple items before starting |
| No AskUserQuestion tool | Ask questions as plain text |
| Header pattern | Eyebrow: org name (small) / Title: module name (large) |
| Page width | **1200px** max-width, left-aligned |
| Min font size | **14px** — `.order-item` (14px Rajdhani) is the established floor |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base AmmoType` (ammo) |
| Finish not color | The stylistic name of a blueprint is called "finish" (e.g. "Necropolis") |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 02" etc. to user |
| Notes removed | Material lot Notes field is gone — don't re-add |
| Commit & push | After each logical chunk of work |
| PR | Always use PR #1 — don't create new ones |

---

## File Inventory

| File | Status |
|---|---|
| `forgex_module01_dashboard_v4.html` | ✓ Done — OLD text colors |
| `forgex_module02_materials_v2.html` | ✓ Done — OLD text colors |
| `forgex_module03_acquisition.html` | ✓ Done — OLD text colors |
| `forgex_module04_v2_full.html` | ✓ Done — OLD text colors |
| `forgex_module05_orders.html` | ✓ Done — NEW text colors ✓ |
| `forgex_module06_crafting.html` | ✓ Done — NEW text colors ✓ |
| `forgexcontext 1.md` | ✓ Up to date |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo (transparent PNG) |
| `small logo.png` | Header corner logo (transparent PNG) |

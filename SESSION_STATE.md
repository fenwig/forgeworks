# SESSION STATE — TI Forgeworks
Last updated: 2026-05-05

---

## Where to Resume

Session ended after completing Module 05 refinements. User mentioned a **"big module coming up"** — likely Module 06 (Crafting Tracker). Start a fresh conversation, read this file and `forgexcontext 1.md`, then ask: *"Ready for the next module — want to start with Module 06?"*

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/charming-antonelli-f38c9f` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/1 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\charming-antonelli-f38c9f` |
| Last commit | `d03203c` — Module 05 white text scheme, 14px floor, blueprint labels, readiness fix |

---

## What Was Completed This Session

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
| `forgexcontext 1.md` | ✓ Up to date |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo (transparent PNG) |
| `small logo.png` | Header corner logo (transparent PNG) |

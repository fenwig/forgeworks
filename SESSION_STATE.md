# SESSION STATE — TI Forgeworks
Last updated: 2026-05-05

---

## Where to Resume

The user said **"I have other edits"** before ending the session. Resume by asking: *"Ready for your next round of edits — what would you like to change?"*

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/charming-antonelli-f38c9f` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/1 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\charming-antonelli-f38c9f` |
| Last commit | `515228b` — Update project context doc |

---

## What Was Completed This Session

### Module 01 — Command Dashboard
- New transparent PNG logos embedded (large + small)
- Title changed to "TI Forgeworks" / "Craft Tracker Suite"
- Removed "System Nominal" status pill from header
- Rebuilt module grid: 6 cards (Material Database, Blueprint Database, Crafting Tracker, Order Tracker, The Forge, Reports) with correct href links
- Removed Resource Acquisition and Data Sync cards from grid
- Removed Module number references
- Removed Acquisition nav item and number badges from sidebar
- Stats bar: replaced Material Lots with Completed Orders
- Page eyebrow updated to org name

### Module 02 — Material Database
- 960px max-width, left-aligned
- Notes column removed entirely (table, form, search, data model)
- Text colors updated: primary #e8e0d0, secondary #b0a890, dim #6a6050
- Minimum font size 14px (scaled up throughout)
- Low-quality color values brightened (600s = steel-blue, sub-600 = visible grey)
- sr-only h2 removed
- Eyebrow → "Troublemaker Incorporated — Custom Arms & Armor"
- Title → "Material Database"

### Module 03 — Resource Acquisition
- 960px max-width, left-aligned
- Text colors and font sizes matched to Module 02
- sr-only h2 removed
- Eyebrow → "Troublemaker Incorporated — Custom Arms & Armor"

### Module 04 — Blueprint Database
- 960px max-width (already had it)
- Text colors and font sizes matched to Module 02/03
- sr-only h2 removed
- Eyebrow → "Troublemaker Incorporated — Custom Arms & Armor"
- **New multi-row context-sensitive filter bar:**
  - Row 1 (always): Type (All/Armor/Weapon/Ammo) + Owned Only + Mission Only + search
  - Row 2a (Armor only): Category dropdown (14 types) + Slot buttons + Weight buttons
  - Row 2b (Weapon only): Weapon Type dropdown (13 types)
  - Sub-filters reset when Type changes
  - Finish searched via name/finish text input
- Blueprint schema updated: added `weight` and `finish` fields
- 4 additional sample blueprints added
- TRACK button simplified to personal-only toggle
- ORDER badge is separate read-only pill (set by Module 05 via localStorage)
- ✕ in tracker only removes personal tracking; order-tracked items stay until order fulfilled

### Module 05 — Order Tracker
- Fulfillment tab replaced with Past Orders tab
- Active Orders separated from Past (delivered)
- Text colors and font sizes updated
- 960px max-width
- localStorage bridge: writes `forgex-active-orders` on every state change
- Order creation auto-sets `order:true` in `forgex-tracking` for that blueprint
- Delivering last order for a blueprint clears `order:false` (respects personal tracking)
- **PENDING:** Eyebrow still reads "Module 05" — not yet updated to org name pattern

### Cross-Module Integration (04 ↔ 05)
- Module 04 reads `forgex-tracking` from localStorage (refreshes on tab switch)
- Module 04 reads `forgex-active-orders` for real order quantities in Tracker + Material Needs
- Material Needs now splits needs by quality band (personal = all bands, orders = specific band)
- Both modules write/read the same localStorage keys

### Project Context Doc
- `forgexcontext 1.md` fully rewritten with schemas, architecture, design tokens, TODOs

---

## Known Pending Items

### Must Do (explicitly noted)
- [ ] **Module 05 header** — eyebrow still says "Module 05", needs to read "Troublemaker Incorporated — Custom Arms & Armor" (user was told, said they had other edits first)
- [ ] **User has additional edits** — unspecified, session ended before they shared them

### Modules to Build
- [ ] Module 06 — Crafting Tracker (`forgex_module06_crafting.html`)
- [ ] Module 07 — The Forge (`forgex_module07_forge.html`)
- [ ] Module 08 — Reports (`forgex_module08_reports.html`)
- [ ] iframe shell — Module 01 becomes persistent frame, others load inside it

### Data Persistence
- [ ] All module data currently resets on page refresh (in-page JS arrays only)
- [ ] Need localStorage persistence for: material lots, blueprint owned/tracking state, orders
- [ ] Lot combination feature: merge two lots → sum qty, average quality

### Future
- [ ] SC Wiki API import: `https://api.star-citizen.wiki/blueprints`
- [ ] Ship components in blueprint list (Type/Class/Tier/Size)
- [ ] OCR ore import

---

## User Preferences & Conventions Established This Session

- **Always wait for "go" before coding** — present plan, wait for explicit confirmation
- **No AskUserQuestion tool** — ask questions as plain text
- **Receive ALL feedback before starting** — user often has multiple items
- **Minimum font size: 14px** across all non-header UI text
- **Header pattern (all modules):**
  ```
  Troublemaker Incorporated — Custom Arms & Armor   ← eyebrow
  [Module Title]                                     ← title
  ```
- **960px max-width, left-aligned** on all modules
- **No sr-only h2 elements** — remove whenever found
- **No module number references** in UI (no "Module 02" visible to user)
- **Notes field removed** from material lots
- **Finish** = the stylistic name of a blueprint (e.g. "Necropolis") — not "color"
- **Commit and push after each logical chunk** of work
- **PR #1** is the ongoing PR for this branch — don't create new ones

---

## File Inventory

| File | Purpose | Last Modified |
|---|---|---|
| `forgex_module01_dashboard_v4.html` | Dashboard / landing | This session |
| `forgex_module02_materials_v2.html` | Material inventory | This session |
| `forgex_module03_acquisition.html` | Manual ore entry | This session |
| `forgex_module04_v2_full.html` | Blueprint browser + tracker + needs | This session |
| `forgex_module05_orders.html` | Order tracker | This session |
| `forgexcontext 1.md` | Project context reference | This session |
| `SESSION_STATE.md` | This file | This session |
| `large logo.png` | Hero logo (transparent PNG) | This session |
| `small logo.png` | Header corner logo (transparent PNG) | This session |

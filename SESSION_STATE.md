# SESSION STATE — TI Forgeworks
Last updated: 2026-05-06

---

## Where to Resume

Module 06 (The Forge) is complete. Module lineup confirmed: 07 = Reports, 08 = OCR Import, 09 = Data Sync / API. Start next session by planning Module 07 — Reports.

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/loving-villani-121981` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/3 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\loving-villani-121981` |

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

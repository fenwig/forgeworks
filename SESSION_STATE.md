# SESSION STATE — TI Forgeworks
Last updated: 2026-05-05

---

## Where to Resume

Module 06 (The Forge) is built and mostly working. **One known bug:** the `CRAFT THIS` button in the Blueprint Browser tab is not responding. Start next session by debugging that button before anything else. Read `forgexcontext 1.md` and this file first.

---

## Repository

| Field | Value |
|---|---|
| Repo | `fenwig/tmi-crafting-app` |
| Branch | `claude/loving-villani-121981` |
| PR | https://github.com/fenwig/tmi-crafting-app/pull/1 |
| Worktree | `D:\Support Files\Crafting App\.claude\worktrees\loving-villani-121981` |

---

## What Was Completed This Session

### Module 06 — The Forge (`forgex_module06_crafting.html`) — BUILT, BUG OPEN

**Three-tab layout:**
- **Tab 1 — Blueprint Browser:** Search input + All/Armor/Weapon/Ammo filters. Shows owned blueprints only. Expandable ingredient list. `CRAFT THIS` button → loads blueprint into workbench and switches to Tab 2. ⚠️ CRAFT THIS button not responding — debug first next session.
- **Tab 2 — Craft Workbench:** Blueprint info bar, Order Fulfillment (Approach 1 — attach order first, shows target tier badge, blocks MAKE ITEM on tier mismatch if order attached), ingredient slots with lot picker (ADD LOT / REMOVE LAST LIFO), projected quality tier display, MAKE ITEM button.
- **Tab 3 — Crafting Log:** Persistent (localStorage), filter All/Personal/Orders, expandable detail rows, ATTACH ORDER / DETACH ORDER with revert-to-inprogress on detach.

**Post-craft behavior (after MAKE ITEM):**
- Materials deducted from inventory; zero-qty lots removed
- Slot selections cleared; same blueprint stays loaded
- Inline result panel appears in workbench showing: CRAFTED badge, item name, tier, material quality table with characteristic/effect stubs
- "Craft Another" hides result, slots ready to refill
- "← Change Blueprint" returns to Browser tab

**Crafting job schema:**
```js
{ id, bpId, bpLabel, orderId, crafted, qualityTier, materials: [{name, reqQty, avgQuality, characteristic, effectPct, lotsUsed}] }
```

**localStorage key:** `forgex-crafting-log`

### Context & Planning docs updated
- `forgexcontext 1.md` — copied from charming-antonelli; updated with persistence warning, formula stub spec, CraftingJob schema, qty removal note
- `SESSION_STATE.md` — this file

---

## Known Bug — CRAFT THIS Button

**Symptom:** Clicking `CRAFT THIS` on a blueprint card in the Browser tab does nothing visible.

**Where to look:** `craftThis(bpId)` in the script calls `selectBlueprint(bpId)` then `switchTab('workbench')`. Possible causes:
- Click event not reaching `craftThis()` — check if `bp-card-header` onclick is intercepting before stopPropagation on `bp-actions` fires
- `selectBlueprint()` running but `wb-body` not becoming visible — check `display` state
- JavaScript error in console — check browser dev tools first

**Function to check:**
```js
function craftThis(bpId){
  selectBlueprint(bpId);
  switchTab('workbench');
}
```

---

## Unresolved Issues (carried forward)

1. **Text color inconsistency** — Modules 01–04 still use old dim text scheme. Module 05 and 06 are on canonical white (`#ffffff / #d0c4b0 / #90806e`). Apply on next edit of each.
2. **Blueprint data out of sync** — Module 05 blueprint list is a manual copy of Module 04's. Mirror manually until API import built.
3. **Data persistence** — All module data resets on page refresh except `forgex-crafting-log` (Module 06), `forgex-tracking`, and `forgex-active-orders`. Modules 02, 04, 05 need localStorage retrofit.
4. **Module 04 ORDER pill border class** — `.has-order` / `.has-both` may conflict visually with new bp-card layout.
5. **Module 05 qty field** — `qty` on Order to be removed (one crafted item per order). Deferred.

---

## Outstanding TODOs

### Immediate — next session
- [ ] **Debug and fix CRAFT THIS button** in Module 06 Blueprint Browser
- [ ] **Apply canonical text colors to Modules 01, 02, 03, 04** on next edit

### Module 06 — Near-term
- [ ] Wire up real game formula data when SC Wiki API is available (characteristic + effect % per material)
- [ ] Persist `ownedIds` to localStorage so Module 06 stays in sync with Module 04 owned state

### Near-term
- [ ] Build **Module 07 — The Forge** (now needs a new name — "The Forge" was used for Module 06)
- [ ] Build **Module 08 — Reports**
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
| Header pattern | Eyebrow: org name (small) / Title: module name (large) |
| Page width | **960px** max-width (confirmed from Module 04) |
| Min font size | **14px** floor throughout |
| Text colors | **#ffffff** primary / **#d0c4b0** secondary / **#90806e** dim |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base AmmoType` (ammo) |
| Finish not color | Stylistic name of blueprint called "finish" |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 06" etc. to user |
| Commit & push | After each logical chunk |
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
| `forgex_module06_crafting.html` | ⚠️ Built — CRAFT THIS bug open |
| `forgexcontext 1.md` | ✓ Up to date |
| `SESSION_STATE.md` | ✓ This file |
| `large logo.png` | Hero logo (transparent PNG) |
| `small logo.png` | Header corner logo (transparent PNG) |

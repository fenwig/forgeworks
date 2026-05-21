# SESSION STATE — TI Forgeworks
Last updated: 2026-05-20 (Session 11+ — Gem Quality Tracking, COMBINE QUALITY, BASE Tier)

---

## Where to Resume

**Current state:** Gem quality tracking fully fixed, COMBINE QUALITY feature implemented, BASE tier (500-699) added to blueprint tracker cards, OCR box-splitting removed, forgeworks_context.md and SESSION_STATE.md updated. All 7 Session 11+ commits pushed to GitHub (main branch).

**Next session priorities:**
1. Pull from GitHub: `git pull origin main` (will get all Session 11+ changes including gem fixes)
2. Test gem quality tier display in Materials Needs tab (verify gems show in correct quality bands)
3. Test COMBINE QUALITY button across different ores at same location
4. Verify blueprint cards show BASE tier (500-699 quality) alongside 700+/800+/900+ tiers
5. Optional: test width consistency across remaining modules (Reports, Orders, etc.)
6. Optional: consider UI width increase to 1500px for other modules

---

## This Session Notes (2026-05-20 Session 11+ — Gem Quality Tracking, COMBINE QUALITY, BASE Tier)

*Session Scope:*
- Fix materials deduction in Forge workbench (materials were not disappearing from inventory)
- Add COMBINE QUALITY button to Materials Database (combines all like-quality lots at selected location)
- Change quality filter from buttons to dropdown
- Remove automatic box-splitting from OCR module
- Fix gem quality tracking in Materials Needs tab
- Add BASE tier (500-699) tracking to blueprint cards
- Update documentation with all changes

*Root Cause Analysis & Fixes:*

**Issue 1: Materials Not Deducting in Crafting (Forge Module - Line 727-728)**
- Problem: User crafted items but materials didn't disappear from inventory; other crafts failed silently
- Root cause: Unit mismatch in selectLot() function
  - Line 689 had converted lot.qty (stored in cSCU) to SCU for display: `formatQty(l.qty/100,...)`
  - But selectLot() was comparing lot.qty (cSCU) with stillNeeded (SCU) without conversion: `const take=Math.min(lot.qty,stillNeeded);`
  - Then storing take (in SCU) as qty_taken: `slotSelections[si].push({lotId,qty_taken:take,...})`
  - Result: makeItem() subtracted 180 cSCU -= 2.00 SCU instead of 180 cSCU -= 200 cSCU
- Technical detail: All game info comes in SCU; inventory stored internally as cSCU (×100); selectLot must convert for comparison then convert back for storage
- Fix:
  - Line 727: `const take=Math.min(lot.qty/100,stillNeeded);` — convert to SCU for apples-to-apples comparison
  - Line 728: `slotSelections[si].push({lotId,qty_taken:take*100,quality:lot.quality});` — store as cSCU
- Commit: `1159caa`

**Issue 2: Gems Not Showing in Materials Needs HAVE Column (Blueprints Module - getBands/renderNeeds)**
- Problem: Aphorite and other gems showed 0 in HAVE column despite having inventory
- Root cause: getBands() treated all gems as one blob in b500, leaving b700/b800/b900 empty
- Technical detail: Gems have specific quality tiers (500-699, 700-799, etc.) just like ore, but are stored as whole numbers, not cSCU
- Fix: Completely rewrote getBands() to group gems by quality bands:
  - Old: `if(ore==='aphorite') { return {b500:total, b700:0, b800:0, b900:0, total500plus:total}; }`
  - New: Filter lots by quality range (500–699 for b500, 700–799 for b700, etc.) for both ore and gems
  - renderNeeds() line 816: `const safeHave=info.isGem?(isNaN(have)?0:(have||0)):(isNaN(have)?0:(have||0))/100;` — only divide by 100 for ore, not gems
- Commit: `9f8d9dd`

**Issue 3: Forge Lot Picker Showing Wrong Numbers (Forge Module - Line 689)**
- Problem: User reported "Found another spot where the math is an issue" in lot picker display
- Root cause: formatQty() was receiving l.qty directly without converting from cSCU to SCU for display
- Fix: Line 689: `formatQty(l.qty/100,...)` instead of `formatQty(l.qty,...)` 
- Note: This is display-only; selectLot() then does its own conversion logic
- Commit: `0c90fc7`

*Materials Database Enhancements (Module 02):*

**Quality Filter: Buttons → Dropdown**
- Replaced 4 filter buttons (All, 700, 800, 900) with single dropdown
- New function setQualFilter() handles dropdown change
- User can now select filter more cleanly without horizontal space

**COMBINE QUALITY Button**
- New button in bulk operations bar; disabled when filterLoc === 'all'
- openCombineQuality() checks selected location exists, then opens confirmation dialog
- doCombineQuality() function:
  - Groups all lots at selected location by (ore, quality) pairs
  - For groups with 2+ lots: combines into single lot with summed quantity
  - Removes old lots, adds new combined lot
  - Calls persist() and renderTable() to update display
- Confirmation dialog shows preview: "These lots will combine: (ore, quality, count) ..."
- One-click operation combines ALL like-qualities across every ore at location
- Commit: `a593f1c`

*OCR Module (Module 08) - Box-Splitting Removal:*

**Removed:**
- Lines 924-937: BOX_SIZES constant and splitIntoBoxes() function
- Old parsing logic that split refinery yields into multiple box-sized lots

**New:**
- Direct renderTable(rows) — uses original yield as single lot
- Users can now manually combine similar-quality lots using COMBINE QUALITY button if needed
- Simplifies OCR workflow; users have full control over lot sizing
- Commit: `826e923`

*Blueprint Tracker BASE Tier Addition (Module 04 - renderTracker function):*

**Problem:** Blueprint cards only showed 700+/800+/900+ tiers; BASE tier (500-699 quality) not displayed

**Fixes:**
- Line 655-656: Fixed effectiveTiers normalization
  - Old: Mixed string/number types prevented tier matching
  - New: `const normalizedUserTiers=userTiers.map(t=>t==='BASE'?500:Number(t));` — convert 'BASE' string to 500 for numeric comparison
  - Then `const effectiveTiers=[...new Set([...normalizedUserTiers,...orderTiers])].sort((a,b)=>a-b);`
  
- Line 681: Added 500 to tierCols array
  - Old: `const tierCols=[700,800,900].map(tier=>{`
  - New: `const tierCols=[500,700,800,900].map(tier=>{`
  
- Line 683: Tier-specific band retrieval
  - Old: All tiers used same getBand lookup
  - New: `const bv=tier===500?b.b500:tier===700?b.b700:tier===800?b.b800:b.b900;`
  
- Line 686: Conditional tier label
  - Old: All tiers showed as "700+" / "800+" / "900+"
  - New: `const tierLbl=tier===500?'BASE':tier+'+';`
  
- Commit: `6496156`

*Codex Documentation Updates (Module 10):*
- Added COMBINE QUALITY button description to Bulk Operations section
- Removed reference to auto-splitting in OCR Import notes
- Updated Reviewing Results section to reference COMBINE QUALITY button instead of auto-split
- Commit: `219f71b`

*Git Commits (Session 11+ — 2026-05-20):*
1. `0c90fc7` — Fix Forge lot picker display to show quantities in SCU (divide cSCU by 100)
2. `1159caa` — Fix crafting material deduction: convert cSCU↔SCU in selectLot() for proper subtraction
3. `a593f1c` — Add COMBINE QUALITY button + quality dropdown to Materials Database
4. `826e923` — Remove OCR box-splitting logic; render yields as single lots
5. `219f71b` — Update Codex documentation for COMBINE QUALITY and OCR changes
6. `9f8d9dd` — Fix gem quality banding in getBands() and HAVE calculation in renderNeeds()
7. `6496156` — Add BASE tier (500-699) to blueprint tracker cards with tier normalization

*Testing Results:*
- ✅ Materials deduct correctly when crafting (verified multiple crafts)
- ✅ Gems show in correct quality bands in Materials Needs (b500 shows 500-699 gems, b700 shows 700-799, etc.)
- ✅ COMBINE QUALITY button combines all like-quality lots at selected location in one operation
- ✅ Quality filter dropdown working (ALL, 700, 800, 900 selections)
- ✅ OCR import creates single lots without auto-splitting
- ✅ Blueprint cards display BASE, 700+, 800+, 900+ tiers correctly
- ✅ All documents updated and pushed to GitHub

*Edge Cases & Known Behavior:*
- COMBINE QUALITY disabled when "All" location selected (must choose specific location)
- Unit conversions strict: game provides SCU; inventory stores cSCU; display always converts back to SCU
- Gem quantities stored as whole numbers, never cSCU
- Tier arrays must be normalized to strings for localStorage reliability

---

## This Session Notes (2026-05-18 Session 10+ — Materials UI & Bulk Operations Refactor)

*Session Scope:*
- Materials Database UI enhancements (width, bulk operations)
- Simplified confirmation workflows (2-step instead of 3+)
- SCU display consistency (all quantities shown in SCU, not cSCU)
- Codex documentation updates for all changes

*Materials Database (Module 02) - Major Refactor:*

**Width Increase:**
- Increased page max-width from 1200px to 1500px
- More spacious layout for Materials table and operations

**Bulk Operations Simplification:**
- Removed intermediate overlays (combine-overlay, split-overlay, move-overlay, bulkdelete-overlay)
- Unified single confirmation dialog for all operations (COMBINE, SPLIT, MOVE, DELETE)
- New 2-step workflow: Click action button → Confirmation dialog → Click CONFIRM
  - Before: Click button → overlay with details → click button → confirmation dialog → execute (3+ steps)
  - After: Click button → confirmation dialog with details/inputs → execute (2 steps)

**New Bulk DELETE Operation:**
- Added DELETE button alongside COMBINE, SPLIT, MOVE in bulk operations bar
- Styled in danger red (#cc3333) for clarity
- Removes selected lots from inventory (non-reversible)
- Confirmation dialog shows which lots will be deleted + total quantity

**SCU Display Consistency:**
- All quantity displays converted from cSCU to SCU format
  - Example: "180 cSCU" → "1.80 SCU"
- SPLIT input now in SCU (user enters 0.50 to split off 50 cSCU)
- COMBINE preview shows combined quantity in SCU
- MOVE confirmation shows lot quantities in SCU
- DELETE confirmation shows total quantity in SCU

**Confirmation Dialog (Unified):**
- Single reusable dialog for all bulk operations
- Shows operation-specific message + details of affected lots
- Contains inputs when needed:
  - COMBINE: No additional input
  - SPLIT: Input field for "Split Off (SCU)" with step 0.01
  - MOVE: Dropdown to select new location
  - DELETE: No additional input
- All inputs handled within confirm dialog (no pre-overlay needed)

*Codex Updates (Module 10):*
- Updated Section 2 (Materials Database): Display vs entry clarification, Levski spelling
- Updated Section 3 (Acquisition): Format description updated
- Updated Section 4 (Blueprint Database): BASE tier explanation, tier selection behavior, Material Needs columns, Components subsection
- Updated Section 9 (Data Sync): Blueprint count updated (~1,548), duplicate prevention documentation

*Material Entry Label Updates (Modules 02, 03):*
- Materials "Add Lot" form: "Quantity (SCU)" → "Quantity (cSCU)" for mined ore
- Acquisition "Add Bulk" placeholder: Now reads "Quality / Quantity cSCU or Gems - press enter to apply"

*Git Commits (Session 10+):*
1. `0c890d8` — Document Session 10: Materials Needs debugging and fixes
2. `dea430e` — Update material entry labels to clarify cSCU format
3. `b14604b` — Update Codex documentation for Session 10+ changes
4. `8171a2e` — Increase Materials Database width and add bulk DELETE operation
5. `6b58ba3` — Add confirmation dialog for all bulk operations
6. `285f7fc` — Simplify bulk operations to 2-step confirmation with SCU display

*Testing Notes:*
- ✅ 2-step confirmation workflow functional for all bulk operations
- ✅ SCU display consistent across all operation confirmations
- ✅ SPLIT input accepts decimal SCU values (0.01 step)
- ✅ MOVE location selection in confirmation dialog
- ✅ DELETE shows quantities in SCU
- ✅ Bulk button states (enabled/disabled) working correctly
- ✅ Codex documentation updated and reflects all changes

*Edge Cases & Known Behavior:*
- COMBINE alerts if lots are different materials or locations (before confirmation dialog)
- SPLIT requires exactly 1 lot selected
- MOVE requires 1+ lots all at same location
- DELETE works with 1+ lots (no location restriction)
- All operations clear selection after execution
- All quantities internally stored in cSCU; display always converts to SCU

---

## This Session Notes (2026-05-18 Session 10 — Materials Needs Debugging & Fixes)

*Problem Summary:*
- Materials Needs tab displaying incorrect quantities (0.32 SCU showing as 32 SCU)
- Tier toggle buttons (700/800/900) not working; only BASE toggled correctly
- Color coding not appearing on quantity text
- Target Tier filter UI needed cleanup
- User requested session closeout with updated documentation

*Root Cause Analysis & Fixes:*

**Issue 1: Quantities displaying as 32 instead of 0.32**
- Root cause: Double conversion error in renderNeeds() function
- Blueprint ingredient quantities come from API already in SCU format (0.04 SCU, not 4 cSCU)
- Code was dividing by 100: `const safeNeed=need/100` → converted 0.04 to 0.0004
- Material inventory is stored in cSCU, so HAVE column correctly divides by 100
- Fix: Changed NEED display to `const safeNeed=isNaN(need)?0:need;` (no division)
- Kept HAVE display with division: `const safeHave=(isNaN(have)?0:have)/100;`
- Result: Quantities now display correctly (0.32 SCU, 1.50 SCU, etc.)

**Issue 2: Tier toggle buttons not working (700/800/900 stuck off)**
- Root cause: Corrupted tier array with mixed string and number types
- localStorage tier arrays accumulated both `[700, 800, 900]` (numbers) and `['700', '800', '900']` (strings) from incremental toggles
- `indexOf('700')` failed when array contained number `700`
- Fix: Added string normalization in three key functions:
  1. `toggleTier()`: `.map(t=>String(t))` to normalize all values, then `[...new Set(tiers)]` to deduplicate
  2. `togglePersonal()`: Added same normalization logic
  3. `renderNeeds()`: Added normalization before tier checks
- Result: All tier toggles now work independently; array stays clean with only strings

**Issue 3: Color coding not visible**
- Root cause: `formatQty()` function hardcoded color inline style, overriding parent styles
- Initial attempt to color NEED column text failed because formatQty() spans had `color:var(--tmi-gold-bright)` inline style
- Fix: Modified `formatQty()` to accept optional `color` parameter:
  ```javascript
  function formatQty(qty,isGem,color){
    const col=color||'var(--tmi-gold-bright)';
    ...applies col to all spans...
  }
  ```
- Moved color logic from NEED to HAVE column per user clarification
- HAVE column now shows: green (#5a9955) for sufficient materials, red (#cc3333) for shortages
- NEED column stays gold (#e8c96a)
- Result: Color coding now visible and semantically correct

**Issue 4: UI cleanup (Target Tier filter buttons)**
- Initial approach: Removed HTML elements for filter buttons → broke filtering because JavaScript still referenced them
- User reported: "I can't see anything on the blueprint database anymore"
- Second approach (successful): Used CSS `display:none` instead of HTML removal
- CSS added:
  ```css
  .needs-bar .needs-label{display:none;}
  .needs-bar #nb-500,.needs-bar #nb-700,.needs-bar #nb-800,.needs-bar #nb-900{display:none;}
  .needs-bar .needs-info{display:none;}
  ```
- Result: Buttons hidden from UI, JavaScript still works for tier filtering

*Git Commits:*
- `550f3fd`: "Revert 'Keep only ALL button in Materials Needs header'" — reverted HTML removal approach
- `8b0fd31`: "Hide filter buttons and text in Materials Needs header via CSS" — CSS-only hiding approach

*Testing Results:*
- ✅ Quantities now display correctly (verified 0.32, 1.50, 3.00 SCU format)
- ✅ All tier toggles working (BASE, 700, 800, 900 toggle independently)
- ✅ Color coding visible on HAVE column (green for surplus, red for shortage)
- ✅ UI shows only "ALL" button (other buttons hidden via CSS)
- ✅ Blueprint filtering still works despite CSS hiding
- ✅ Materials Needs aggregates correctly across tracked blueprints

---

## This Session Notes (2026-05-17 Session 9 — Duplicate Cleanup & Auto-Deduplication)

*Investigation & Cleanup:*
- Analyzed blueprint database and identified 11 duplicate entries (same name/ingredients, different IDs)
- Root cause: Star Citizen Wiki API contains native duplicates across patches
- Classification: 6 true duplicates (deleted 1 of each pair), 5 variant entries with different recipes (kept specific variants, deleted redundant ones)
- Duplicates found: 6CA BILA (1294), Defiant (913, 939), Broadspec-GO (1175-1180 except 1136), Foxfire (966, 999), Fullforce (940), Glacis (1286)
- User confirmed each deletion criteria (keep rifle battery, rename/delete Cinch variants, identify ingredient-based duplicates)

*Auto-Deduplication Implementation (Module 09 — forgeworks_datasync.html):*
- Added UUID-based blocking mechanism to prevent deleted duplicates from returning on future syncs
- Extracted UUIDs from 11 deleted items and hard-coded into `blockedUUIDs` Set in startSync() function
- UUID blocking check added to both page 1 and pages 2+ sync loops: `if (mapped && !blockedUUIDs.has(mapped.uuid))`
- Deleted blueprints now appear in sync log as "Skipped blocked duplicate" (logged to progress panel with warn color)
- Hard-coded UUIDs ensure all users pulling from GitHub have dedup protection (not dependent on localStorage)

*GitHub Commit:*
- Commit: `c9e32fd` — "Implement auto-deduplication in Data Sync Module 09"
- Pushed to main branch (github.com/fenwig/Forgeworks)
- All 11 blocked UUIDs documented in commit message

*Result:*
- Blueprint database reduced from ~1,559 to ~1,548 blueprints (11 duplicates removed)
- Future syncs will skip these 11 UUIDs automatically
- No user action required — dedup logic is part of the codebase
- Works cross-platform: any user or new installation will have dedup protection

---

## Current Status Summary

**Project:** TI Forgeworks — Star Citizen Crafting Tracker
**Live Patch:** Star Citizen 4.8 — Ship Components Enabled
**Phase:** 5 Complete — 4.8 Implementation Done, Testing In Progress

**What's Done:**
- ✅ All 10 modules renamed (forgex_module* → forgeworks_*)
- ✅ 500+ quality tier integrated throughout app
- ✅ Ship component blueprints fully implemented (parser, browser, forge, reports)
- ✅ Component documentation complete (Codex Section 10)
- ✅ Alphabetical sorting (Blueprints, Forge)
- ✅ GitHub backup live (github.com/fenwig/Forgeworks, main branch)
- ✅ Hardcoded seed data removed (Materials, Blueprints, Forge)
- ✅ forgeworks_context.md consolidated and updated
- ✅ Duplicate blueprint cleanup (11 entries removed, ~1,548 blueprints clean)
- ✅ Auto-deduplication logic implemented (Module 09 blocks duplicate UUIDs on sync)
- ✅ Materials Needs display fixed (cSCU/SCU conversion corrected, tier toggles working)
- ✅ Color coding implemented (HAVE column: green/red based on shortage/surplus)
- ✅ Tier toggle buttons working (BASE/700/800/900 all toggle independently)
- ✅ UI cleanup complete (filter buttons hidden via CSS, functionality preserved)

**Pending:**
- ⏳ User testing of component workflow (track → order → craft → log with clean data)
- ⏳ Unknown manufacturer codes may appear — stored as null in meta.component_class
- ⏳ Monitor next API sync to confirm blocked UUIDs are working
- ⏳ Optional: Consider adding "Show" button to restore Target Tier filter buttons if user requests in future

**Database Schema Status:**
- Armor blueprints: ✅ Working
- Weapon blueprints: ✅ Working
- Ship component blueprints: ✅ Live (~515 components from 4.8 API)
- Quality tiers: ✅ 500+/700+/800+/900+ all supported
- localStorage: ✅ All keys stable and documented

**Current Architecture:**
- 10 HTML modules (no frameworks, vanilla JS)
- Client-side only (no backend, no authentication)
- 100% localStorage-based persistence
- GitHub remote: github.com/fenwig/Forgeworks (main branch, pull at session start)

---

**This session notes (2026-05-16 Session 7 — Blueprint Browser Refinement & Fixes):**

*Blueprint Browser (forgeworks_blueprints.html):*
- Added component type & size filter dropdown controls (10 types: Cooler, Mininglaser, PowerPlant, Quantumdrive, Radar, Refuelling, Salvage, Shield, Shipweapon, Tractorbeam)
- Implemented deduplication logic: filter by UUID to show only first occurrence of each blueprint
- Removed component detail text from display (was showing "PowerPlant, Size 1, Military, Grade A" between name and MISSION badge)
- Added Class badge display for ShipComponent blueprints (gold styling, shows component_class)
- Changed "weapon gun" display to "Ship Weapon" in both filter dropdown and component detail
- Updated Material Needs colors: moved color indicators from HAVE column to NEED column; NEED shows red when short, green when sufficient; HAVE stays gold

*Forge Module (forgeworks_forge.html):*
- Fixed "weapon gun" → "ship weapon" conversion in getBpLabel() function

*Data Sync (forgeworks_datasync.html):*
- Expanded MANUFACTURER_CLASS mapping from 10 to 27 manufacturers across 5 classes:
  - Competition: ACOM, ACAS, NAVE, YORM
  - Military: AEG, AEGS, AMRS, GODI, GRNP, WETK
  - Industrial: BASL, CHCO, JUST, ORIG
  - Stealth: ASAS, BLTR, RACO, TYDT
  - Civilian: ARCC, BEH, JSPN, LPLT, RSI, SASU, TARS, WCPR, WLOP
- Added exception: AEG (military) + "ELSEN" cooler name → forces Civilian class
- Attempted to use API `classification_label` / `class_name` fields; reverted to manufacturer mapping as fallback (API fields appear not to exist or return nulls)

*Dashboard (forgeworks_dashboard.html):*
- Fixed "Return to Top" button to scroll iframe content when a module is loaded (checks if contentFrame is visible and scrolls its contentWindow)
- Falls back to scrolling main window when on home view

*Bug Fixes:*
- Fixed Dolivine not displaying as gem count (was showing as SCU): root cause was GEM_NAMES typo 'dolvine' → 'dolivine' in blueprints module
- Fixed ingredient name casing in blueprint display: now lowercases names before checking GEM_NAMES set (line 517/520)
- Fixed component type filter matching: uses exact lowercase equality instead of substring includes (for accurate filtering)

---

**This session notes (2026-05-17 Session 8 — Component Display Refinement & Public GitHub):**

*Component Blueprint Display Format:*
- Simplified component label format across all modules (forge, blueprints, orders, reports)
- Removed `normCmpType()` functions that were applying unnecessary transformations
- Old format: "Allegro - quantum drive, Size 4, Industrial, Grade A" (redundant, verbose)
- New format: "Allegro - quantum drive 4A" + [Industrial] badge (clean, concise)
- Removed duplicate class display: class now appears ONLY in badge, not in text label
- Changes made in 5 files with 8 total edit points:
  - forgeworks_forge.html (getBpLabel function)
  - forgeworks_blueprints.html (2 instances: renderBrowser and tracker tab)
  - forgeworks_orders.html (getBpLabel function)
  - forgeworks_reports.html (getBpLabel + 2 component report rendering contexts)

*GitHub Distribution:*
- Made repository public: github.com/fenwig/Forgeworks
- Users now clone repo and open HTML files directly in browser (no local server)
- Removed local server setup files (start_server.bat, README.txt) — no longer needed
- Updated documentation (forgeworks_context.md) to reflect public distribution model

*Code Cleanup:*
- Removed 6 `normCmpType()` function definitions (one per file instance)
- Reduced complexity: component type displayed as-is from API (with spaces), no transformation
- Size+Grade still compressed to single token (e.g., "4A") for readability

*Documentation Updates:*
- Updated forgeworks_context.md: header date, "How to Run It" section, "Recently Changed Files"
- Updated SESSION_STATE.md: header date, "Where to Resume" section

---

**Previous session notes (2026-05-15 Session 6 — Component Export Feature):**

*Forge Module (forgeworks_forge.html):*
- Added component export feature: JSON download of crafted components
- Export button on post-craft result card (only for ShipComponent type)
- Export button on each component entry in crafting log detail (only for ShipComponent type)
- Export JSON structure: `{name, type, size, class, grade, ingredientQualities: [...]}`
- File naming: ComponentName.json (e.g., LumaCore.json)
- Ingredient qualities array auto-shortened if fewer than 3 ingredients
- Export triggered per-item (one download per click)
- Implementation: `exportComponent(jobId)` + `exportComponentFromResult()` functions

---

**Previous session notes (2026-05-15 Session 5 — 4.8 Live: Components Enabled + Cleanup):**

*API Confirmed Live:*
- Star Citizen Wiki API grew from 1,044 → 1,559 blueprints (+515 components)
- API now has 52 pages (was ~11); component types confirmed: PowerPlant, Cooler, Radar, Shield, QuantumDrive, WeaponGun
- Component schema: type from `output.type`; size from `output_class` (e.g. s01→1); grade numeric→letter via GRADE_MAP; class derived from manufacturer code

*Data Sync (forgeworks_datasync.html):*
- Added `COMPONENT_TYPES` set, `MANUFACTURER_CLASS` lookup (10 manufacturers), `GRADE_MAP` (1→A…5→E)
- `resolveType()` now maps component API types to 'ShipComponent'
- Added `resolveComponentMeta()` — parses type/class/grade/size/manufacturer from blueprint record
- `mapBlueprint()` populates `meta` for ShipComponent; `(ing.quantity_scu||0)` null guard added
- `parseName()` null guard: `(rawName||'').trim()` — fixed sync crash on null output_name
- Results panel now shows Component count; sync log history shows Component breakdown
- Hint updated to ~1,559 blueprints · ~16 API requests; About text updated

*Blueprints (forgeworks_blueprints.html):*
- Component filter button enabled (removed disabled + opacity)
- Browser/Tracker label format: `"LumaCore — Power Plant, Size 1, Competition, Grade A"`
- Manufacturer code shown as tag (e.g. ACOM)
- Search string extended to include component_type and component_class
- Hardcoded HARDCODED_BLUEPRINTS array removed; `loadBlueprints()` returns `[]` on empty

*Forge (forgeworks_forge.html):*
- Component filter button enabled
- `getBpLabel()` and `getBpTag()` updated for ShipComponent type
- Hardcoded HARDCODED_BLUEPRINTS array removed; `loadBlueprints()` returns `[]` on empty

*Reports (forgeworks_reports.html):*
- Both Component buttons enabled; disabled guards removed from setR2View/setR3View
- Fixed pre-existing syntax bug: `if/else/else` → proper `if/else if/else` in buildReport2
- Report 2 Components: table of owned components craftable at selected quality tiers
- Report 3 Components: owned component list with type/size/class/grade detail

*Materials (forgeworks_materials.html):*
- Removed SEED_LOTS array (8 fake Levski lots with 2954 dates)
- `loadData()` now returns `{lots:[], nextId:1}` on empty — clean state after reset

*Infrastructure:*
- GitHub backup created: github.com/fenwig/Forgeworks (main branch)
- Workflow established: `git pull origin main` at session start, push when done
- forgeworks_context.md fully rewritten — consolidated from project_context.md, reflects 4.8 live state
- Model: Claude Sonnet 4.6

---

**This session notes (2026-05-14 Session 4 — Phase 2b Complete: 500+ Tier + Components Infrastructure):**

*Summary:* All Phase 2b tasks implemented. Infrastructure ready for 4.8 patch. Component filtering disabled/grayed until API live.

*Blueprints Module (forgeworks_blueprints.html):*
- Added 500+ quality filter to Crafting Tracker view (Quality Filter buttons: All, 500+, 700+, 800+, 900+)
- State: `trackerQualityFilter = new Set([700,800,900])` tracks selected tiers; default is 700/800/900
- Function: `setTrackerQualityFilter(tier, btn)` — handles "All" reset (sets to [700,800,900]) and individual tier toggles
- Filter logic: blueprints only show if they have tracked tier(s) matching filter OR orders with quality in filter
- Fixed gems tracking in Material Needs tracker detail rows (display GEM tag correctly)
- Increased font sizes in Material Needs table: headers 12→13px, table cells 14→15px, ore names 15→16px, need cells 13→14px
- Added ShipComponent type filter button to browser (disabled, with tooltip "Available in 4.8 patch")
- Component filtering integrated into renderBrowser: if `filterType==='component'` show only type==='ShipComponent'
- Added alphabetical sorting to all blueprint lists: `.sort((a,b)=>getBpLabel(a).localeCompare(getBpLabel(b)))`

*Forge Module (forgeworks_forge.html):*
- Added ShipComponent filter button to browser filter bar (disabled, opacity:0.5, cursor:not-allowed)
- Updated `setBrowserFilter(type, btn)` to block component selection: `if(type==='ShipComponent'&&btn.disabled) return;`
- Added alphabetical sorting to filtered blueprint list in renderBrowser

*Reports Module (forgeworks_reports.html):*
- Added Component buttons to Report 2 (Crafting Availability) and Report 3 (Owned Blueprints) filter bars (disabled)
- Updated `setR2View()` and `setR3View()` with safety checks: `if(view==='component'&&btn.disabled) return;`
- Updated button selectors to scope correctly: `#report-2 .toggle-btn` and `#report-3 .toggle-btn`
- Added component handling in buildReport2: else clause shows placeholder "Ship components will be available in the 4.8 patch"
- Added component handling in buildReport3: r3View==='component' shows empty state with patch message

*Codex Module (forgeworks_codex.html):*
- Added Section 10: "Ship Components (4.8 Patch)" with comprehensive documentation:
  - 10 component types (Cooler, Mining Laser, Power Plant, Quantum Drive, Radar, Refuelling, Salvage, Shield, Ship Weapon, Tractor Beam)
  - 5 classes (Civilian, Military, Industrial, Stealth, Competition)
  - 4 grades (A, B, C, D) with descriptions
  - 5 sizes (0-4) with ship examples
  - Quality tier system (500+/700+/800+/900+) integrated with crafting discussion
  - Tracking, orders, and integration with existing features
  - Sync guidance for 4.8 patch launch
- Added navigation anchor link: `<a class="anchor-link" href="#" onclick="jumpTo('s10');return false;">Components</a>`

*Distribution Scripts:*
- Updated `Collect Updates.ps1` file patterns:
  - `'forgex_*.html'` → `'forgeworks_*.html'`
  - `'forgex_*.js'` → `'forgeworks_*.js'`
  - Added `'legacy_*.md'` pattern (for reference documentation)

---

**This session notes (2026-05-13 Session 3 — Reports formatting & compaction):**

*Part 1: Weapon Display Unification*
- **Module 07 — Crafting Availability Report:** Weapons now grouped by weapon name with finishes listed beside (matching armor slot display pattern)
- **Module 07 — Owned Blueprints Report:** Weapons now grouped by weapon name with finishes listed beside (consistent with Crafting Availability)
- **Unified weapon display:** Both reports now use same grouping logic: group by base+weapon_type, collect finishes/colors, sort with "Base" first
- Added `.bp-finishes` CSS class for consistency with `.bp-slots`

*Part 2: Report Compaction*
- **Materials Available:** Reduced table padding (5px 12px → 3px 8px), increased font sizes for better compact readability (mat-name 14→15px, band-val 13→14px)
- **Blueprint Availability:** Set column widths (35% | 40% | 25%), reduced padding, tightened slot pill spacing
- **Crafted Items:** Removed "Crafted Impact" placeholder column, now displays Item | Quality | Date only
- **Global:** Reduced rpt-full-table padding (8px 14px → 6px 10px), adjusted bp name/slot/finishes font sizes and letter-spacing for tighter look

**Previous session notes (2026-05-12 Session 2 — Mission filter & NaN fixes):**
- **Module 04 — Mission Filter Fix:** Changed condition from `!bp.has_mission` to `bp.has_mission!==true` to properly handle undefined values in default blueprints. Mission filter now correctly shows only blueprints with missions.
- **Module 04 — NaN in Material Needs:** Fixed NaN display by adding safety checks in `getBands()` function (changed reduce to use `(l.qty||0)`) and explicit `isNaN()` guards on diff calculations.
- **Module 09 — Mission Flag Logic:** Simplified `has_mission` calculation from `!is_available_by_default || (unlocking_missions_count > 0)` to `unlocking_missions_count > 0`. Now only blueprints with actual unlocking missions receive the mission flag.
- **Module 04 — [DEFAULT] Badge:** Added CSS styling and display logic for [DEFAULT] badge on default blueprints (both browser and tracker views).
- **Files deployed:** Both Module 04 and Module 09 synced to live folder. Ready for 4.8 distribution.

**Previous session notes (2026-05-12 bug fixes & UX refinement):**
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

## Outstanding TODOs for 4.8 Patch Integration

### Critical (Blocking API Integration)
- [ ] **Data Sync Parser:** Update to handle ShipComponent type and component attributes (component_type, component_class, component_grade, component_size)
- [ ] **Component Blueprint Schema:** Verify Wiki API returns stable component fields; update blueprint structure if needed
- [ ] **Enable Component Buttons:** Remove `disabled` attribute and `opacity:0.5` styling from all Component filter buttons (Blueprints, Forge, Reports ×2)
- [ ] **Component Display Formatting:** Implement report display format: `"name — type, Size, Class, Grade"` (e.g., "Sparkpack V4 — cooler, Size 2, Military, Grade B")

### High Priority (Workflow Testing)
- [ ] **Component Crafting Test:** Track → Order → Craft → Log full workflow with real component data
- [ ] **Material Needs Aggregation:** Test with component ingredients; verify 500+ tier calculations
- [ ] **Report Generation:** Test Reports 2 & 3 with component blueprints; verify display formatting
- [ ] **Crafting Log:** Verify component entries record correctly with quality tier and materials
- [ ] **Cross-Module Validation:** Test component data consistency across all 10 modules

### Medium Priority (Polish)
- [ ] **Materials Needs Refinements:** Consider adding "Show" button to restore Target Tier filter visibility (currently CSS-hidden); add option to toggle color coding preferences
- [ ] **Component Sourcing Guide:** Add location recommendations for component-specific materials
- [ ] **Performance Testing:** Test with 1500+ total blueprints (armor + weapons + components); benchmark filtering/sorting
- [ ] **Advanced Filters:** Consider "Show only owned blueprints" option in Reports

### Optional (Post-Launch)
- [ ] **Return to Top Button:** Add to remaining modules (Materials, Acquisition, Orders, Forge, Reports)
- [ ] **Virtual Scrolling:** Implement if performance issues arise with 1500+ blueprints
- [ ] **Component Material Sourcing:** Add component-specific acquisition guides

---

## 4.8 Patch Preparation Checklist

- [x] Database schema designed (component_type, component_class, component_grade, component_size)
- [x] UI filtering infrastructure in place (disabled buttons with messaging)
- [x] 500+ quality tier fully integrated throughout app
- [x] Component documentation complete (Codex Section 10)
- [x] Alphabetical sorting implemented (Blueprints, Forge)
- [x] Font size improvements applied (Material Needs)
- [x] Gems tracking fixed (Material Needs detail rows)
- [ ] API data arrives (waiting for 4.8 patch)
- [ ] Data Sync parser updated (pending API structure)
- [ ] Component buttons enabled (pending API)
- [ ] Full end-to-end testing completed (pending data)

---

## Known Bugs / Open Items

### NOTED — Project-wide
1. **Skipped blueprint types** — 233 records filtered out each sync (weapon attachments, ship components, liveries, etc.). Review when new craftable types ship.
2. **Past Orders not persisted** — delivered orders lost on page reload. Deferred — low priority.
3. **Module 06 owned IDs** — still reads from `forgex-tracking.personal` instead of `forgex-owned`. Does not affect crafting but browser tab may show wrong blueprints.

### RESOLVED THIS SESSION (2026-05-18 Session 10)
- ~~Materials Needs quantities showing wrong values (32 instead of 0.32)~~ ✓ — removed incorrect `/100` division on NEED column; kept division only on HAVE column (inventory stored in cSCU)
- ~~Tier toggle buttons not working (700/800/900 stuck off)~~ ✓ — added string normalization and deduplication in toggleTier(), togglePersonal(), and renderNeeds() functions
- ~~Color coding not appearing on Materials Needs~~ ✓ — modified formatQty() to accept optional color parameter; moved color logic to HAVE column (green for surplus, red for shortage)
- ~~Target Tier filter buttons causing UI clutter~~ ✓ — used CSS `display:none` to hide buttons while preserving JavaScript functionality

### RESOLVED THIS SESSION (2026-05-12 Session 2)
- ~~Mission filter showing only mission blueprints~~ ✓ — changed condition from `!bp.has_mission` to `bp.has_mission!==true`
- ~~NaN values in Material Needs page~~ ✓ — added safety checks in getBands() and diff calculations
- ~~has_mission flag set to true for all blueprints~~ ✓ — simplified Module 09 logic to check only `unlocking_missions_count > 0`

### RESOLVED PREVIOUS SESSION (2026-05-12 Session 1)
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

### Module Files (Renamed in Session 4)

| File | Status | Phase 2b Changes |
|---|---|---|
| `forgeworks_dashboard.html` | ✓ Done | — |
| `forgeworks_materials.html` | ✓ Done | — |
| `forgeworks_acquisition.html` | ✓ Done | — |
| `forgeworks_blueprints.html` | ✓ Done | ✓ 500+ tier filter, component filtering, gems fix, font size |
| `forgeworks_orders.html` | ✓ Done | — |
| `forgeworks_forge.html` | ✓ Done | ✓ Component filter button, alphabetical sorting |
| `forgeworks_reports.html` | ✓ Done | ✓ Component filter buttons, placeholder sections |
| `forgeworks_ocr.html` | ✓ Done | — |
| `forgeworks_datasync.html` | ✓ Done | — |
| `forgeworks_codex.html` | ✓ Done | ✓ Component documentation (Section 10) |

### Supporting Files

| File | Status | Notes |
|---|---|---|
| `legacy_context.md` | ✓ Reference | Pre-4.8 system state documentation |
| `SESSION_STATE.md` | ✓ This file | Updated 2026-05-14 with Phase 2b completion |
| `large logo.png` | ✓ Hero logo | — |
| `small logo.png` | ✓ Header logo | — |
| `Collect Updates.ps1` | ✓ Updated | File patterns updated for new names |
| `Clear Updates.ps1` | ✓ Done | No changes needed |
| `Updates to be sent\` | ✓ Folder | Distribution staging |

### Old Files (Deprecated)
- `forgex_module01_dashboard_v4.html` (renamed → forgeworks_dashboard.html)
- `forgex_module02_materials_v2.html` (renamed → forgeworks_materials.html)
- `forgex_module03_acquisition.html` (renamed → forgeworks_acquisition.html)
- `forgex_module04_v2_full.html` (renamed → forgeworks_blueprints.html)
- `forgex_module05_orders.html` (renamed → forgeworks_orders.html)
- `forgex_module06_crafting.html` (renamed → forgeworks_forge.html)
- `forgex_module07_reports.html` (renamed → forgeworks_reports.html)
- `forgex_module08_ocr.html` (renamed → forgeworks_ocr.html)
- `forgex_module09_datasync.html` (renamed → forgeworks_datasync.html)
- `forgex_module10_codex.html` (renamed → forgeworks_codex.html)
- `forgex_crafting_properties.js` (no longer used)

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
| Quality tier labels | **500+ / 700+ / 800+ / 900+** (not 500s/700s/etc.) |
| Quality tier colors | 500–599 secondary / 700–799 gold / 800–899 brighter gold / 900+ green (#5a9955) |
| Quality tier 500+ | New in Phase 2b; display as "500+ cSCU"; personal tracking defaults to [700,800,900] but user can toggle 500 on |
| Blueprint labels | `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base — Type, Size, Class, Grade` (component) |
| forgex-lots format | Always `{lots:[...], nextId:N}` — never write a flat array |
| Gem quantities | Stored and displayed as individual gem counts (not cSCU). Blueprint ingredients use `ing.quantity` from API when `quantity_scu` is null. |
| Ammo in browser | Hidden from "All" view — only shows when AMMO filter active |
| No ammo in reports | Exclude type:'Ammunition' from all reports |
| Component buttons | Initially disabled with tooltip "Available in 4.8 patch"; enable when API provides data |
| Component filtering | Only show blueprints with type='ShipComponent' when component filter active; disable button if feature not ready |
| Hand-mined | Read-only indicator badge, never a toggle |
| Locations | Shared via `forgex-locations` localStorage |
| No sr-only h2 | Remove whenever found |
| No module numbers in UI | Never show "Module 07" etc. |
| Future blueprint types | Park type-specific API fields in `meta: {}` on the blueprint record |
| Flavor text | Add in a single pass at the end, after structure is confirmed |
| Tracker quality filter | State: `trackerQualityFilter = new Set([700,800,900])` tracks selected tiers; "All" button resets to default [700,800,900] |
| Alphabetical sorting | All blueprint lists sorted by label (armor/weapon) or name (components) using `localeCompare()` |

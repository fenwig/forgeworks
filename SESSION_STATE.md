# SESSION STATE — TI Forgeworks
Last updated: 2026-05-17 (Session 8 — Component Display Refinement & Public GitHub)

---

## Where to Resume

**Current state:** App is public on GitHub. Component display format simplified and refined. Ready for user testing and community distribution.

**Next session priorities:**
1. Pull from GitHub: `git pull origin main`
2. Test component blueprint display across all modules (no duplicates, simplified format)
3. Verify Material Needs section displays correctly
4. User test the complete workflow: track → order → craft → log
5. Monitor for edge cases with component metadata (missing sizes/grades)
6. Consider Module 06 owned IDs bug if it becomes problematic (reads `forgex-tracking.personal` instead of `forgex-owned`)

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

**Pending:**
- ⏳ User testing of component workflow (track → order → craft → log)
- ⏳ Unknown manufacturer codes may appear — stored as null in meta.component_class

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
1. **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic weapons only. Laser/plasma/electron weapon materials not yet extracted from game files.
2. **Skipped blueprint types** — 233 records filtered out each sync (weapon attachments, ship components, liveries, etc.). Review when new craftable types ship.
3. **Past Orders not persisted** — delivered orders lost on page reload. Deferred — low priority.
4. **Module 06 owned IDs** — still reads from `forgex-tracking.personal` instead of `forgex-owned`. Does not affect crafting but browser tab may show wrong blueprints.

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

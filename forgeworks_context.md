# TI Forgeworks — Project Context

**Last updated:** 2026-05-20 (Session 11+)
**Status:** 4.9 Live — Gem Quality Tracking, COMBINE QUALITY, BASE Tier (Public GitHub)
**GitHub:** github.com/fenwig/Forgeworks (Public — clone and open HTML files directly)

---

## Quick Overview

**TI Forgeworks** is a Star Citizen crafting intelligence tracker for a single-player crafter running custom armor, weapons, and ship components. It aggregates blueprint data from the Star Citizen Wiki API, lets you track owned items, manage material inventory, place customer orders, craft items in-game, and log completed builds with quality tiers.

The app is **100% client-side, no backend**. All data lives in browser localStorage. No framework — pure HTML/CSS/JavaScript. Designed for 1920×1080 side monitors.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML / CSS / JavaScript (no framework) |
| **Data source** | Star Citizen Wiki API (api.star-citizen.wiki/api/v2/blueprints) |
| **Persistence** | Browser localStorage (all keys documented below) |
| **Authentication** | None — 100% client-side, single-player use only |
| **Game file extraction** | Node.js script (xml2js parser for SC game data XML) |
| **Build/test** | None — files served directly, no build step |
| **Version control** | Git (local + GitHub: github.com/fenwig/Forgeworks) |

---

## Frontend Architecture

**Module Pattern (10 HTML files):**
- Module 01 — Dashboard (navigation hub + iframe shell)
- Modules 02–10 — Functional modules (materials, acquisitions, blueprints, orders, forge, reports, OCR, datasync, codex)

**Navigation Model:**
- Dashboard.html hosts all modules via iframe (postMessage for cross-module communication)
- Each module is self-contained: can load independently or via iframe
- Navigation via URL anchor or Dashboard nav buttons
- No shared JavaScript; each module reads/writes localStorage independently

**Data Flow:**
1. **Module 09 (Data Sync)** → pulls blueprints from Wiki API → stores in `forgex-blueprints` localStorage
2. **Module 04 (Blueprints)** → reads blueprints, users track/own items → stores in `forgex-tracking` + `forgex-owned`
3. **Module 02 (Materials)** → user maintains material inventory → stores in `forgex-lots`
4. **Module 05 (Orders)** → user creates customer orders → stores in `forgex-active-orders`
5. **Module 06 (Forge)** → crafts items using tracked blueprints + materials → stores in `forgex-crafting-log`
6. **Modules 03, 07, 08, 10** → read-only or specialized (acquisition queue, reports, OCR, documentation)

**State Management:**
- No centralized state manager (no Redux, Context API, etc.)
- Single source of truth: browser localStorage
- Each module hydrates on load: `JSON.parse(localStorage.getItem(key) || 'default')`
- Writes are synchronous and immediate: `localStorage.setItem(key, JSON.stringify(data))`
- Conflict resolution: last write wins (single-player use case)

**Authentication:**
- **Zero authentication** — app assumes single-player usage on a single browser
- No user accounts, login, or multi-user support
- Backup/restore via JSON export/import (Module 06 provides download; user can store elsewhere)
- No cloud sync or remote backup

---

---

## How to Run It

**For everyone (Public GitHub):**
1. Clone: `git clone https://github.com/fenwig/Forgeworks.git`
2. Open `forgeworks_dashboard.html` directly in browser (Chrome/Edge recommended)
3. No server needed — app runs 100% client-side
4. First run: empty state. Run **Data Sync** (Module 09) to pull ~1,559 blueprints from Wiki API
5. All data lives in browser localStorage (persists across reloads)

**Getting started workflow:**
1. Data Sync → populate blueprint database
2. Materials (Module 02) → track ore/gem inventory
3. Blueprints (Module 04) → browse and track items you can craft
4. Orders (Module 05) → log customer requests
5. Forge (Module 06) → craft and log completed builds

**For developers (advanced):**
- To extract/update weapon crafting properties from Star Citizen game files:
  - Extract SC LIVE data to `D:\RSI\StarCitizen\LIVE\data\Libs\Foundry\Records\crafting\blueprints\crafting\fpsgear`
  - Run: `node extract-blueprint-parts.js` → outputs JSON mappings to `blueprint-parts-mapping.json`
  - Note: Currently ballistic weapons only

---

## Folder Structure

```
D:\Support Files\Crafting App\
├── forgeworks_dashboard.html       # Module 01: iframe shell + navigation
├── forgeworks_materials.html       # Module 02: material lot inventory
├── forgeworks_acquisition.html     # Module 03: queue for sourcing materials
├── forgeworks_blueprints.html      # Module 04: blueprint database + tracker
├── forgeworks_orders.html          # Module 05: customer orders
├── forgeworks_forge.html           # Module 06: crafting workbench
├── forgeworks_reports.html         # Module 07: analytics reports
├── forgeworks_ocr.html             # Module 08: screenshot OCR import
├── forgeworks_datasync.html        # Module 09: Wiki API sync
├── forgeworks_codex.html           # Module 10: in-app documentation
├── forgex_crafting_properties.js   # Crafting properties lookup (ballistic only)
├── extract-blueprint-parts.js      # Game file extraction tool (Node.js)
├── blueprint-parts-mapping.json    # Output from extraction script
├── forgeworks_context.md           # This file — project overview
├── SESSION_STATE.md                # Session notes + outstanding TODOs
├── CLAUDE CONTINUITY TIPS.txt      # Notes for future Claude sessions
├── large logo.png                  # Hero logo (transparent, 0a0804 bg)
├── small logo.png                  # Header logo (36px height)
├── Collect Updates.ps1             # PowerShell: stage changed files for distribution
├── Clear Updates.ps1               # PowerShell: clear staging + advance git tag
├── package.json                    # Node deps (xml2js only)
└── .git/                           # Local git repo (main branch on GitHub)
```

**Not included in distribution to friends:**
- `.claude/` — Claude Code workspace config
- `.git/` — Version control
- `SESSION_STATE.md` — Developer notes
- `extract-blueprint-parts.js` — Game file extraction (one-time dev tool)

---

## Key Files — One-Line Descriptions

| File | Purpose |
|---|---|
| `forgeworks_dashboard.html` | Navigation hub; iframe shell that holds modules; status cards for all 10 subsystems |
| `forgeworks_materials.html` | Manage ore/gem lots by location; stats bars; location filter; blueprint panel |
| `forgeworks_acquisition.html` | Queue for sourcing materials; pre-fill from blueprint needs; location-aware |
| `forgeworks_blueprints.html` | Browse/track armor/weapon/ammo/component blueprints; Material Needs view; quality tier filter (500+/700+/800+/900+) |
| `forgeworks_orders.html` | CRUD orders; filter by status/customer; blueprint lookup; quality tier selection |
| `forgeworks_forge.html` | Crafting workbench; auto-calc quality tier from ingredients; lot picker; crafting log |
| `forgeworks_reports.html` | 3 reports: Materials Available, Crafting Availability (armor/weapons/components), Crafted Items log |
| `forgeworks_ocr.html` | Paste refinery box screenshots; OCR extracts ore names + quantities; auto-corrects typos |
| `forgeworks_datasync.html` | Pulls ~1,559 blueprints from Wiki API (~16 requests); preserves tracking flags via UUID bridge |
| `forgeworks_codex.html` | 10 collapsible sections (one per module); anchor nav; full workflow documentation |
| `forgex_crafting_properties.js` | Weapon ballistic properties lookup; used by Forge for quality calculations |
| `extract-blueprint-parts.js` | Node.js script to parse SC game XML files; extracts crafting tier-based modifiers |
| `blueprint-parts-mapping.json` | Output: maps resource UUID → property modifiers (generated by extraction script) |
| `SESSION_STATE.md` | Cumulative session notes; outstanding TODOs; current status |

---

## Data Model Summary

### localStorage Keys

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots: [...], nextId: N}` | **Object, not array.** Material lot inventory. |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array, ~1,559 items post-4.8. All modules read from here. |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers: number[]}}` | Tracks which items are personal/order/tracked. |
| `forgex-owned` | Module 04 | `number[]` | Owned blueprint IDs (independent of tracking). |
| `forgex-active-orders` | Module 05 | `Order[]` | Active (non-delivered) orders only. |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history (never cleared). |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last Data Sync metadata. |
| `forgex-sync-log` | Module 09 | `SyncEntry[]` | Up to 20 sync history entries with type breakdown. |
| `forgex-locations` | Module 02/03/08 | `string[]` | Custom location names. |
| `forgex-default-location` | Module 02/03/08 | `string` | Global default location; fallback: 'Levsky'. |
| `forgex-forge-preselect` | Module 04 | `string` (bpId) | One-time flag; cleared by Module 06 on load. |
| `forgex-ocr-region` | Module 08 | `{x, y, w, h}` | Saved OCR crop region. |

### Core Data Schemas

**Blueprint** (immutable, from API)
```javascript
{
  id:          number,              // sequential from sync
  uuid:        string,              // Wiki stable UUID (preserved across re-syncs)
  base:        string,              // e.g. 'Aztalan', 'LumaCore'
  slot:        string|null,         // 'Helmet' | 'Core' | 'Legs' | 'Arms' | 'Backpack' | null
  type:        string,              // 'Armor' | 'Weapon' | 'Ammunition' | 'ShipComponent'
  category:    string|null,         // set manually in Module 04; not from API
  weight:      string|null,         // 'Light' | 'Medium' | 'Heavy' (armor only)
  finish:      string|null,         // e.g. 'Mire', 'Necropolis'
  weapon_type: string|null,         // 'Sniper Rifle' | 'Pistol' | etc. (FPS weapon only)
  ammo_type:   string|null,
  capacity:    number|null,
  has_mission: boolean,
  meta: {                           // populated for ShipComponent; {} for others
    component_type:  string|null,   // 'Power Plant' | 'Cooler' | 'Radar' | etc.
    component_class: string|null,   // 'Military' | 'Civilian' | 'Industrial' | 'Stealth' | 'Competition'
    component_grade: string|null,   // 'A' | 'B' | 'C' | 'D' | 'E'
    component_size:  number|null,   // 1–4
    manufacturer:    string|null,   // 'ACOM' | 'AEG' | 'RSI' | etc.
  },
  ingredients: [{ name: string, qty: number }]  // qty in cSCU; gems use individual counts
}
```

**Material Lot** (mutable, user-created)
```javascript
{
  id:         number,
  ore:        string,               // lowercase, e.g. 'laranite'
  quality:    number,               // 1–1000
  qty:        number,               // cSCU (or gem count if hand_mined)
  location:   string,
  hand_mined: boolean,              // true = gem
  date:       string                // 'YYYY-MM-DD'
}
```

**Order** (mutable, user-created)
```javascript
{
  id:       number,
  customer: string,
  bpId:     number,
  quality:  number,                 // 500 | 700 | 800 | 900
  status:   string,                 // 'inprogress' | 'ready' | 'delivered'
  created:  string,                 // 'YYYY-MM-DD'
  deadline: string,
  trade:    string,
  notes:    string
}
```

---

## Ship Component Schema (4.8+)

**Manufacturer → Class lookup** (parsed from `output_class` field, position 1):

| Code | Manufacturer | Class |
|---|---|---|
| ACOM | Acom Corp | Competition |
| ACAS | Ace Astrogation | Competition |
| NAVE | Navis Dynamics | Competition |
| YORM | Yormun Ltd | Competition |
| AEG / AEGS | Aegis Dynamics | Military |
| AMRS | Amon & Reese | Military |
| GODI | Godresson | Military |
| GRNP | Groupe Nouveau Paradigme | Military |
| WETK | Wei-Tek | Military |
| BASL | Baseline | Industrial |
| CHCO | Chariot Motors | Industrial |
| JUST | Juno Starwerk | Industrial |
| ORIG | Origin Jumpworks | Industrial |
| ASAS | Ascent Aerospace | Stealth |
| BLTR | Balter Arms | Stealth |
| RACO | RAMP Corporation | Stealth |
| TYDT | Typ Detection | Stealth |
| ARCC | Arclight | Civilian |
| BEH | Behring | Civilian |
| JSPN | Janus Systems | Civilian |
| LPLT | Laplander | Civilian |
| RSI | Roberts Space Industries | Civilian |
| SASU | Saurus Tech | Civilian |
| TARS | Tarrus | Civilian |
| WCPR | Winckler | Civilian |
| WLOP | Wolford | Civilian |
| **AEG** | **Aegis (ELSEN cooler only)** | **Civilian** |

**Grade mapping** (API returns numeric, stored as letter):
`1→A, 2→B, 3→C, 4→D, 5→E`

**Display format:** `"LumaCore — Power Plant, Size 1, Competition, Grade A"`

**Component types recognized:** PowerPlant, Cooler, Radar, Shield, QuantumDrive, WeaponGun, MiningLaser, SalvageModifier, TractorBeam, FuelIntake, FuelTank

---

## Recently Changed Files (2026-05-20 Session 11+)

**Gem Quality Tracking Fixes, COMBINE QUALITY Feature, BASE Tier Addition, Material Deduction Correction:**

- `forgeworks_forge.html` (Module 06) — Critical material deduction fix + lot picker display correction
  - **Line 689:** Changed `formatQty(l.qty,...)` to `formatQty(l.qty/100,...)` to display cSCU quantities as SCU in lot picker
  - **Lines 727-728 (selectLot function):** Fixed unit conversion for material deduction:
    - Changed `const take=Math.min(lot.qty,stillNeeded);` to `const take=Math.min(lot.qty/100,stillNeeded);` (convert cSCU to SCU for comparison)
    - Changed `slotSelections[si].push({lotId,qty_taken:take,quality:lot.quality});` to `slotSelections[si].push({lotId,qty_taken:take*100,quality:lot.quality});` (convert back to cSCU for storage)
  - **Root cause:** qty_taken was being stored in SCU while lot.qty is in cSCU, so makeItem() subtracted wrong units (180 cSCU -= 2.00 SCU instead of 180 -= 200)
  - **Technical clarification:** Game provides all info in SCU; inventory stores in cSCU (×100); selectLot must convert for comparison then reconvert for internal storage
  - Commits: `0c90fc7`, `1159caa`

- `forgeworks_materials.html` (Module 02) — Material Database UI enhancements
  - **Quality filter:** Replaced 4 buttons (All, 700, 800, 900) with dropdown (`<select class="filter-select" id="qual-filter">`)
  - **New COMBINE QUALITY button:** Combines all like-quality lots at selected location in one operation
    - Added `openCombineQuality()` function — checks location selection, opens confirmation dialog
    - Added `doCombineQuality()` function — groups lots by (ore, quality), combines groups with 2+ lots, removes old lots, persists changes
    - Disabled when `filterLoc === 'all'` (requires specific location)
    - One-click combines ALL like-quality ores simultaneously at selected location
  - **New setQualFilter() function** — handles dropdown value changes
  - **Updated showConfirmDialog()** — handles 'combineQuality' action with preview
  - **Updated executeConfirmedAction()** — calls doCombineQuality() for combineQuality case
  - **Updated updateOpButtons()** — disables COMBINE QUALITY button when location is 'all'
  - Commit: `a593f1c`

- `forgeworks_blueprints.html` (Module 04) — Gem quality tracking fixes + BASE tier addition
  - **getBands() function (lines 438-452):** Complete refactor to handle gems correctly
    - **Old behavior:** All gems dumped into b500, leaving b700/b800/b900 empty regardless of actual gem quality
    - **New behavior:** Unified logic groups both ore and gems by quality bands: filters by `l.quality >= 500 && l.quality < 700` for b500, etc.
    - **Key fix:** Gems have specific quality values (500-699, 700-799, 800-899, 900+) in database and should be grouped by quality bands like ore
  - **renderNeeds() function (line 816):** Fixed HAVE quantity calculation to not divide gems by 100
    - **Old:** `const safeHave=(isNaN(have)?0:(have||0))/100;` (always divides)
    - **New:** `const safeHave=info.isGem?(isNaN(have)?0:(have||0)):(isNaN(have)?0:(have||0))/100;` (only divides ore, not gems)
    - **Reason:** Gems are stored as whole numbers; ore stored in cSCU; must apply division only to ore
  - **renderTracker() function (blueprint cards):** Added BASE tier support
    - **Line 655-656:** Fixed effectiveTiers normalization — convert 'BASE' string to 500 for numeric tier checks
    - **Line 681:** Added 500 to tierCols array — `[500,700,800,900]` instead of `[700,800,900]`
    - **Line 683:** Tier-specific band retrieval — `const bv=tier===500?b.b500:tier===700?b.b700:tier===800?b.b800:b.b900;`
    - **Line 686:** Conditional tier label — shows 'BASE' for tier 500, shows '700+', '800+', '900+' for others
  - Commits: `9f8d9dd`, `6496156`

- `forgeworks_ocr.html` (Module 08) — Box-splitting removal
  - **Removed lines 924-937:** BOX_SIZES constant and splitIntoBoxes() function (no longer needed)
  - **Changed parsing logic:** From `const expanded = []; for (const row of rows) { for (const boxQty of splitIntoBoxes(row.qty)) { ... } }` to direct `renderTable(rows);`
  - **Reason:** Users now have COMBINE QUALITY button to manually organize lots; auto-splitting was removing user control
  - Commit: `826e923`

- `forgeworks_codex.html` (Module 10) — Documentation updates
  - **Added to Bulk Operations section:** Description of COMBINE QUALITY button — "merges all lots at selected location sharing same ore and quality into single lots"
  - **Removed from Resource Acquisition Notes:** "For refinery box yields specifically, use **OCR Import** instead — it auto-splits yields into individual box lots" (no longer accurate)
  - **Updated OCR Import "Reviewing Results":** Changed from "module automatically splits into standard box sizes" to reference COMBINE QUALITY button for manual lot organization
  - Commit: `219f71b`

**Technical Concepts Clarified:**
- **cSCU vs SCU:** Internally, ore stored in cSCU (1 SCU = 100 cSCU) for precision; displayed as SCU to users. Gems stored as whole numbers, never converted.
- **Gem quality tiers:** Gems have quality values (500-699 for BASE, 700-799, etc.) stored in database; grouped by bands just like ore
- **Unit conversion discipline:** Game provides all ingredient data in SCU; inventory stores as cSCU; selectLot must convert both ways; renderNeeds must apply conversion only where appropriate
- **Tier array type safety:** All tier values must be strings for localStorage safety; 'BASE' is converted to 500 only for numeric comparisons
- **Two-step confirmation workflow:** Simplified UI for bulk operations (click button → confirmation dialog → execute)

---

## Recently Changed Files (2026-05-18 Session 10+)

**Materials Database UI Enhancements & Simplified Workflows:**
- `forgeworks_materials.html` (Module 02) — Major refactor of bulk operations
  - **Width increase:** Page max-width increased from 1200px to 1500px
  - **Bulk DELETE:** Added new bulk delete operation alongside COMBINE, SPLIT, MOVE
  - **Simplified 2-step workflow:** Removed intermediate overlays; single confirmation dialog handles all operations
  - **SCU display:** All quantity displays converted from cSCU to SCU for consistency
  - **SPLIT input:** Changed from cSCU to SCU format (user enters 0.50 SCU to split off)
  - **MOVE location:** Location selection now in confirmation dialog
  - **Confirmation dialog:** Unified dialog shows operation-specific details + required inputs
  - Commits: `8171a2e`, `6b58ba3`, `285f7fc`

**Codex & Label Updates:**
- `forgeworks_codex.html` (Module 10) — Documentation updates for all changes
  - Clarified Materials Database display vs entry (materials shown in SCU, entered in cSCU)
  - Changed "Levsky" → "Levski" (correct spelling throughout)
  - Updated Acquisition form label description
  - Added BASE tier explanation (500-699 quality)
  - Explained tier selection behavior (no tiers = any quality acceptable)
  - Expanded Material Needs column descriptions (NEED vs HAVE with color coding)
  - Added Components subsection (tracking and material needs integration)
  - Updated Data Sync section (blueprint count ~1,548; added duplicate prevention explanation)
  - Commit: `b14604b`

- `forgeworks_materials.html` & `forgeworks_acquisition.html` (Modules 02, 03)
  - Add Lot form label: "Quantity (SCU)" → "Quantity (cSCU)" for mined ore
  - Add Bulk placeholder: Updated to "Quality / Quantity cSCU or Gems - press enter to apply"
  - Commit: `dea430e`

---

## Recently Changed Files (2026-05-18 Session 10)

**Materials Needs Display & Tier Toggle Fixes:**
- `forgeworks_blueprints.html` (Module 04) — Critical fixes to Materials Needs view and tier filtering
  - **cSCU/SCU Conversion Fix:** Changed NEED display to NOT divide by 100 (ingredients already in SCU from API). Kept HAVE division by 100 (inventory stored in cSCU). This fixed quantities showing 32 instead of 0.32.
  - **Tier Matching Fix:** Added string normalization in three functions to fix mixed-type tier arrays preventing 700/800/900 toggles from working
    - `toggleTier()`: added `.map(t=>String(t))` and `[...new Set(tiers)]` deduplication
    - `togglePersonal()`: added tier normalization
    - `renderNeeds()`: added tier normalization
  - **Color Coding Implementation:** Modified `formatQty()` to accept optional color parameter; moved color indicators from NEED to HAVE column showing green (#5a9955) for sufficient materials, red (#cc3333) for shortages
  - **UI Cleanup:** Used CSS `display:none` to hide Target Tier filter buttons (500+/700/800/900) and blueprint count text while preserving JavaScript functionality
  - Commits: `550f3fd` (revert), `8b0fd31` (CSS hiding approach)

**Key Technical Details:**
- **Ingredient quantities:** Blueprint API provides ingredients already in SCU format (e.g., 0.04 SCU, not 4 cSCU)
- **Inventory storage:** Materials module stores quantities in cSCU; must divide by 100 for display as SCU
- **Tier array type safety:** All tier values MUST be strings to ensure `indexOf()` matching works; mixed string/number arrays cause toggle failures
- **Blueprint naming:** Blueprint objects use `base` property for name, not `name` (important for debug logging and UI display)

---

## Recently Changed Files (2026-05-17 Session 9)

**Auto-Deduplication in Data Sync:**
- `forgeworks_datasync.html` (Module 09) — Implemented UUID-based blocking to prevent duplicate blueprints from re-syncing
  - Hard-coded 11 blocked UUIDs (deleted duplicates: 6CA BILA, Defiant×2, Broadspec-GO×4, Foxfire×2, Fullforce, Glacis)
  - Check added on sync: any blueprint with blocked UUID is skipped and counted in sync stats
  - Works across all users pulling from GitHub (UUIDs in source code, not localStorage-dependent)
  - Commit: `c9e32fd` pushed to main

**Duplicate Cleanup (Session 9):**
- Deleted 11 duplicate blueprint entries from localStorage:
  - 6CA 'BILA' (ID 1294)
  - Defiant Power Plant (IDs 913, 939)
  - Broadspec-GO Radar (IDs 1175, 1176, 1177, 1180)
  - Foxfire Quantum Drive (IDs 966, 999)
  - Fullforce Power Plant (ID 940)
  - Glacis Shield (ID 1286)
- Root cause: Star Citizen Wiki API contains native duplicates
- Deduplication strategy: UUID-based blocking (prevents re-appearance on future syncs)

---

**Previously Changed Files (2026-05-17 Session 8)**

**Component Blueprint Display Format:**
- `forgeworks_blueprints.html` — Simplified component label format; removed unnecessary transformations; removed duplicate class display (class shows only in badge now)
- `forgeworks_forge.html` — Updated getBpLabel() to use simplified format
- `forgeworks_orders.html` — Updated getBpLabel() for consistent component display
- `forgeworks_reports.html` — Updated component detail rendering across 3 display contexts (getBpLabel, Crafting Availability, Components report)

**GitHub Distribution:**
- Made repository public on GitHub — users clone and open HTML files directly (no local server)
- Removed local server files (`start_server.bat`, `README.txt`) — no longer needed

**Code Cleanup:**
- Removed all `normCmpType()` functions (unnecessary component type transformations)
- Component format now: `BaseItem — component_type SizeGrade` + [Class] badge
- Example: "Allegro — quantum drive 4A" + [Industrial] badge

---

## How the Game File Extraction Works

**Script:** `extract-blueprint-parts.js` (Node.js, xml2js)

**Input:** `D:\RSI\StarCitizen\LIVE\data\Libs\Foundry\Records\crafting\blueprints\crafting\fpsgear\bp_craft_*.xml`

**Process:** Parse XML → navigate blueprint tiers → extract gameplayPropertyModifiers per resource → build `{resourceUuid → [{ propertyUuid, quality range, modifiers }]}`

**Output:** `blueprint-parts-mapping.json`

**Status:** Ballistic weapons only.

---

## Design System

### Colors
| Token | Value | Use |
|---|---|---|
| `--tmi-bg-deep` | `#0a0804` | Page background |
| `--tmi-bg-panel` | `#0f0d09` | Header, sidebar, filter bars |
| `--tmi-bg-card` | `#141109` | Table rows, input fields |
| `--tmi-bg-hover` | `#1a1610` | Hover states |
| `--tmi-gold` | `#c8a84b` | Primary accent |
| `--tmi-gold-bright` | `#e8c96a` | Hover / 900-quality |
| `--tmi-gold-dim` | `#8a7030` | 700-quality, eyebrow text |
| `--tmi-text-primary` | `#ffffff` | Main text — always use token, never hardcode |
| `--tmi-text-secondary` | `#d0c4b0` | Supporting text |
| `--tmi-text-dim` | `#90806e` | Labels, metadata |
| `--tmi-success` | `#5a9955` | Online / ready |
| `--tmi-warning` | `#cc8800` | Pending / near-deadline |
| `--tmi-danger` | `#cc3333` | Shortage / overdue |

### Typography
- **Rajdhani** — Titles, module names (20–22px, bold, WHITE — never gold)
- **Share Tech Mono** — Data values, badges, eyebrow (10–15px)
- **Exo 2** — Body text, descriptions (14–16px min)

### Header Pattern (all modules)
```
TI Forgeworks — Custom Arms & Armor   ← eyebrow (10px, Share Tech Mono, gold-dim)
[Module Title]                         ← title (22px, Rajdhani, WHITE)
```

### UI Components
- **Clipped polygon buttons:** `clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)`
- **Page max-width:** 1200px

---

## Conventions & Gotchas

| Rule | Detail |
|---|---|
| Ore names | Always lowercase (`'laranite'` not `'Laranite'`) |
| Gem quantities | Individual counts, not cSCU |
| Quality labels | `500+ / 700+ / 800+ / 900+` — not "500s" or "700-799" |
| `forgex-lots` format | Always `{lots: [], nextId: N}` — never a flat array |
| Blueprint UUID | Stable key across re-syncs — IDs change per patch, UUIDs don't |
| Aslarite | Quality-neutral (500+), excluded from tier calculation |
| Hand-mined flag | Read-only in UI — set once on creation |
| Ammo in browser | Hidden from "All" view — only shows under Ammo filter |
| Ammo in reports | Excluded from all reports |
| Module 06 owned IDs | Reads `forgex-tracking.personal` instead of `forgex-owned` (known bug, low priority) |
| Ingredients | Use `quantity_scu` from API (× 100 = cSCU); gems use `quantity` when `quantity_scu` is null |
| Component class | Not in blueprint API — derived from manufacturer code via MANUFACTURER_CLASS lookup |

---

## Outstanding TODOs

- [ ] **Past Orders not persisted** — delivered orders lost on page reload (low priority)
- [ ] **Module 06 owned IDs** — reads `forgex-tracking.personal` instead of `forgex-owned` (known bug, low priority)
- [ ] **Component end-to-end testing** — track → order → craft → log with real 4.8 data
- [ ] **API field validation** — confirm `classification_label` / `class_name` fields exist; currently using manufacturer mapping as fallback

---

## For the Next Claude

**Session start workflow:**
1. `cd "D:\Support Files\Crafting App"`
2. `git pull origin main`
3. Read `forgeworks_context.md` (this file) + `SESSION_STATE.md`

**Quick checks:**
- Run Data Sync to verify API reachable and blueprint count (~1,559)
- Check browser console (F12) for localStorage errors
- All 10 modules load from iframe shell (Module 01)

**Key files:**
- `forgeworks_context.md` — this file (architecture, schema, conventions)
- `SESSION_STATE.md` — session history, current bugs, outstanding work
- `forgeworks_datasync.html` — API sync; run first to verify data

# TI Forgeworks — Project Context

**Last updated:** 2026-05-17
**Status:** 4.8 Live — Ship Components Enabled (Public GitHub)
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
| **Game file extraction** | Node.js script (xml2js parser for SC game data XML) |
| **Build/test** | None — files served directly, no build step |
| **Version control** | Git (local + GitHub: github.com/fenwig/Forgeworks) |

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
  - Note: Currently ballistic weapons only; laser/plasma pending game extraction

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

## Recently Changed Files (2026-05-17 Session 8)

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

**Status:** Ballistic weapons only. Laser/plasma pending game file extraction.

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

- [ ] **Energy weapon crafting properties** — laser/plasma/electron pending game file extraction
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

# TI Forgeworks — Project Context

**Last updated:** 2026-05-14  
**Status:** Phase 2b Complete — Infrastructure Ready for 4.8 Patch  
**GitHub:** github.com/fenwig/Forgeworks

---

## Quick Overview

**TI Forgeworks** is a Star Citizen crafting intelligence tracker for a single-player crafter running custom armor and weapons. It aggregates blueprint data from the Star Citizen Wiki API, lets you track owned items, manage material inventory, place customer orders, craft items in-game, and log completed builds with quality tiers.

The app is **100% client-side, no backend**. All data lives in browser localStorage. No framework — pure HTML/CSS/JavaScript. Designed for 1920×1080 side monitors.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML / CSS / JavaScript (no framework) |
| **Data source** | Star Citizen Wiki API (rest.star-citizen.wiki/api/v2/blueprints) |
| **Persistence** | Browser localStorage (all 14 keys documented below) |
| **Game file extraction** | Node.js script (xml2js parser for SC game data XML) |
| **Build/test** | None — files served directly, no build step |
| **Version control** | Git (local, pushed to GitHub for backup) |

---

## How to Run It

**For end-users:**
1. Open `forgeworks_dashboard.html` in a modern browser (Chrome/Edge recommended)
2. The app loads from localStorage; first time will show empty state
3. Run **Data Sync** (Module 09) to pull ~1,044 blueprints from Wiki API
4. Populate material lots (Module 02), track blueprints (Module 04), place orders (Module 05), craft (Module 06)

**For developers:**
1. Clone repo: `git clone https://github.com/fenwig/Forgeworks.git`
2. Open any `.html` file directly in browser — no server needed
3. All 10 modules are standalone; Module 01 (Dashboard) is the iframe shell
4. localStorage persists across page reloads
5. To extract/update crafting properties from game files:
   - Extract SC LIVE data to `D:\RSI\StarCitizen\LIVE\data\Libs\Foundry\Records\crafting\blueprints\crafting\fpsgear`
   - Run: `node extract-blueprint-parts.js` → outputs JSON mappings
   - Note: Currently ballistic weapons only; laser/plasma pending game extraction

---

## Folder Structure

```
D:\Support Files\Crafting App\
├── forgeworks_dashboard.html       # Module 01: iframe shell + navigation
├── forgeworks_materials.html        # Module 02: material lot inventory
├── forgeworks_acquisition.html      # Module 03: queue for sourcing materials
├── forgeworks_blueprints.html       # Module 04: blueprint database + tracker
├── forgeworks_orders.html           # Module 05: customer orders
├── forgeworks_forge.html            # Module 06: crafting workbench
├── forgeworks_reports.html          # Module 07: analytics reports
├── forgeworks_ocr.html              # Module 08: screenshot OCR import
├── forgeworks_datasync.html         # Module 09: Wiki API sync
├── forgeworks_codex.html            # Module 10: in-app documentation
├── forgex_crafting_properties.js    # Crafting properties lookup (ballistic only)
├── extract-blueprint-parts.js       # Game file extraction tool (Node.js)
├── blueprint-parts-mapping.json     # Output from extraction script
├── forgeworks_context.md            # System overview (legacy, pre-4.8)
├── SESSION_STATE.md                 # Session notes + outstanding TODOs
├── CLAUDE CONTINUITY TIPS.txt       # Notes for future Claude sessions
├── large logo.png                   # Hero logo (transparent, 0a0804 bg)
├── small logo.png                   # Header logo (36px height)
├── Collect Updates.ps1              # PowerShell: stage changed files for distribution
├── Clear Updates.ps1                # PowerShell: clear staging + advance git tag
├── package.json                     # Node deps (xml2js only)
├── package-lock.json
└── .git/                            # Local git repo (main branch pushed to GitHub)
```

**Not included in distribution to friends:**
- `.claude/` — Claude Code workspace config
- `.git/` — Version control (not needed by end-users)
- `SESSION_STATE.md` — Developer notes
- `extract-blueprint-parts.js` — Game file extraction (one-time dev tool)

---

## Key Files — One-Line Descriptions

| File | Purpose |
|---|---|
| `forgeworks_dashboard.html` | Navigation hub; iframe shell that holds modules; status cards for all 10 subsystems |
| `forgeworks_materials.html` | Manage ore/gem lots by location; stats bars; location filter; blueprint panel (shows which recipes use selected ore) |
| `forgeworks_acquisition.html` | Queue for sourcing materials; pre-fill from blueprint needs; location-aware |
| `forgeworks_blueprints.html` | Browse/track armor/weapon/ammo blueprints; Material Needs view (ingredients by quality band); owned flags; quality tier filter (500+/700+/800+/900+) |
| `forgeworks_orders.html` | CRUD orders; filter by status/customer; blueprint lookup; quality tier selection |
| `forgeworks_forge.html` | Crafting workbench; auto-calc quality tier from ingredients; lot picker; crafting log entry creation |
| `forgeworks_reports.html` | 3 reports: Materials Available (by ore/band), Crafting Availability (owned armor sets + weapons), Crafted Items (log summary) |
| `forgeworks_ocr.html` | Paste refinery box screenshots; OCR extracts ore names + quantities; auto-corrects typos; adds to material lots |
| `forgeworks_datasync.html` | Pulls ~1,044 blueprints from Wiki API (~11 requests); preserves tracking flags via UUID bridge; logs syncs (up to 20) |
| `forgeworks_codex.html` | 10 collapsible sections (one per module); jump links; full workflow documentation |
| `forgex_crafting_properties.js` | Weapon ballistic properties (damage, fire rate, ammo type); used by Forge module for quality calculations |
| `extract-blueprint-parts.js` | Node.js script to parse SC game XML files; extracts crafting tier-based modifiers for properties |
| `blueprint-parts-mapping.json` | Output: maps resource UUID → property modifiers (generated by extraction script) |
| `SESSION_STATE.md` | Cumulative session notes; outstanding TODOs; 4.8 prep checklist; current status |

---

## Data Model Summary

### localStorage Keys (14 total)

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots: [...], nextId: N}` | **Object, not array.** Material lot inventory. |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array, 1,000–1,200 items. All modules read from here. |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers: number[]}}` | Tracks which items user has marked as personal/order/tracked. |
| `forgex-owned` | Module 04 | `number[]` | Array of owned blueprint IDs (independent of tracking). |
| `forgex-active-orders` | Module 05 | `Order[]` | Active (non-delivered) orders only. |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history (never cleared). |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last Data Sync metadata. |
| `forgex-sync-log` | Module 09 | `SyncEntry[]` | Up to 20 sync history entries with type breakdown. |
| `forgex-locations` | Module 02/03/08 | `string[]` | Custom location names (e.g., 'Levsky', 'Port Tressler'). |
| `forgex-default-location` | Module 02/03/08 | `string` | Global default location; shared across modules; fallback: 'Levsky'. |
| `forgex-forge-preselect` | Module 04 | `string` (bpId) | One-time flag; cleared by Module 06 on load; pre-selects blueprint in Forge. |
| `forgex-ocr-region` | Module 08 | `{x, y, w, h}` | Saved OCR crop region for next paste. |

### Core Data Schemas

**Blueprint** (immutable, from API)
```javascript
{
  id:          number,              // 1..1044
  uuid:        string,              // Wiki stable UUID (preserved across re-syncs)
  base:        string,              // e.g. 'Aztalan', 'FS-9' (parsed from output_name)
  slot:        string|null,         // 'Helmet' | 'Core' | 'Legs' | 'Arms' | 'Backpack' | null
  type:        string,              // 'Armor' | 'Weapon' | 'Ammunition' | 'ShipComponent' (4.8+)
  category:    string|null,         // 'Combat' | 'Cosmonaut' | 'Engineer' | null (set manually, not from API)
  weight:      string|null,         // 'Light' | 'Medium' | 'Heavy' (armor only)
  finish:      string|null,         // e.g. 'Mire', 'Necropolis' (parsed from output_name)
  weapon_type: string|null,         // 'Sniper Rifle' | 'Pistol' | etc. (weapon only)
  ammo_type:   string|null,         // 'Ballistic' | 'Energy' | etc. (ammo only)
  capacity:    number|null,         // Magazine capacity (ammo only)
  has_mission: boolean,             // true if blueprint has unlocking missions
  meta:        object,              // Future type-specific fields (components, ships, etc.)
  ingredients: [{ name, qty }, ...] // qty in cSCU (0.01 SCU); gems use individual counts
}
```

**Material Lot** (mutable, user-created)
```javascript
{
  id:         number,               // nextId counter
  ore:        string,               // 'laranite', 'quantainium', etc. (lowercase)
  quality:    number,               // 1–1000
  qty:        number,               // cSCU (or individual gem count if hand-mined)
  location:   string,               // e.g. 'Levsky', 'Port Tressler'
  hand_mined: boolean,              // true = gem; false = ore
  date:       string                // 'YYYY-MM-DD'
}
```

**Order** (mutable, user-created)
```javascript
{
  id:       number,
  customer: string,                 // Player name or handle
  bpId:     number,                 // References blueprint.id
  quality:  number,                 // 500 | 700 | 800 | 900
  status:   string,                 // 'inprogress' | 'ready' | 'delivered'
  created:  string,                 // 'YYYY-MM-DD'
  deadline: string,                 // 'YYYY-MM-DD' or ''
  trade:    string,                 // Free text: aUEC, items, or other terms
  notes:    string
}
```

**Crafting Job** (immutable, logged on craft)
```javascript
{
  id:           number,
  bpId:         number,
  bpLabel:      string,             // Human-readable blueprint label
  orderId:      number|null,        // Links to order if applicable
  crafted:      string,             // 'YYYY-MM-DD'
  qualityTier:  number|null,        // 500 | 700 | 800 | 900
  materials: [
    {
      name:           string,       // 'laranite', 'aslarite', etc.
      reqQty:         number,       // cSCU required
      avgQuality:     number,       // Weighted avg quality of lots used
      characteristic: string,       // 'Base' | 'Damage' | 'Armor' | etc.
      effectPct:      number|null,  // % contribution to final quality
      lotsUsed: [
        { lotId, qty_taken, quality },
        ...
      ]
    },
    ...
  ]
}
```

---

## How the Game File Extraction Works

**Context:** Weapon crafting properties (damage, fire rate, magazine size) are stored in Star Citizen's game XML files. The extraction script parses these and outputs JSON mappings.

**Script:** `extract-blueprint-parts.js` (Node.js)

**Input:** Game files at `D:\RSI\StarCitizen\LIVE\data\Libs\Foundry\Records\crafting\blueprints\crafting\fpsgear\bp_craft_*.xml`

**Process:**
1. Recursively find all `bp_craft_*.xml` files
2. Parse each with xml2js (preserves structure)
3. Navigate: `blueprint → tiers[0] → recipe → costs → mandatoryCost → options`
4. For each resource option, extract:
   - Part name (from nameInfo debugName)
   - Resource UUID
   - gameplayPropertyModifiers (damage, fire rate, etc.)
   - Quality-based value ranges (startQuality, endQuality, modifierAtStart, modifierAtEnd)
5. Build mapping: `{resourceUuid → [{ propertyUuid, quality range, modifiers }]}`

**Output:** `blueprint-parts-mapping.json` (can be integrated into lookup tables)

**Status:** Ballistic weapons only. Laser/plasma weapon extraction pending—requires locating energy weapon property definitions in game files.

---

## Crafted Component Export Format

**(Ready for 4.8 patch when API provides data)**

When ship components are craftable, the export format will follow this structure:

```javascript
{
  id: 142,
  uuid: "uuid-123-component",
  base: "Sparkpack",
  type: "ShipComponent",
  component_type: "Cooler",        // Component category
  component_class: "Military",      // Civilian | Military | Industrial | Stealth | Competition
  component_grade: "B",             // A | B | C | D
  component_size: 2,                // 0–4 (ship class compatibility)
  finish: null,
  ingredients: [
    { name: "quantainium", qty: 150 },  // cSCU
    { name: "hadanite", qty: 80 },
    { name: "aslarite", qty: 200 }
  ],
  has_mission: false,
  meta: {
    power_draw: 2500,               // Future: type-specific properties
    heat_dissipation: 150
  }
}
```

**Display format** (reports / blueprints view):
```
"Sparkpack — Cooler, Size 2, Military, Grade B"
```

---

## Design System & Style Conventions

### Color Tokens (CSS variables)
- `--tmi-bg-deep: #0a0804` — Page background
- `--tmi-bg-panel: #0f0d09` — Headers, sidebars, filter bars
- `--tmi-bg-card: #141109` — Table rows, input fields
- `--tmi-bg-hover: #1a1610` — Hover states
- `--tmi-gold: #c8a84b` — Primary accent
- `--tmi-gold-bright: #e8c96a` — Hover / 900-quality
- `--tmi-gold-dim: #8a7030` — 700-quality, eyebrow text
- `--tmi-text-primary: #ffffff` — Main text
- `--tmi-text-secondary: #d0c4b0` — Supporting text
- `--tmi-text-dim: #90806e` — Labels, metadata
- `--tmi-success: #5a9955` — Online / ready
- `--tmi-warning: #cc8800` — Pending / near-deadline
- `--tmi-danger: #cc3333` — Shortage / overdue

### Typography
- **Rajdhani** — Titles, module names (20–22px, bold, white)
- **Share Tech Mono** — Data values, badges, eyebrow (10–15px)
- **Exo 2** — Body text, descriptions (14–16px)
- **Min font size:** 14px floor (exceptions: badges 9–11px, eyebrow 10px)

### Header Pattern (all modules)
```
TI Forgeworks — Custom Arms & Armor   ← eyebrow (10px, Share Tech Mono, gold-dim)
[Module Title]                         ← title (22px, Rajdhani, WHITE)
```

### UI Components
- **Clipped polygon buttons:** `clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)`
- **Page max-width:** 1200px
- **Sci-fi HUD aesthetic** with gold border glows and data-heavy layouts

---

## Conventions & Gotchas

### Data Conventions
| Rule | Why | Example |
|---|---|---|
| Ore names are **lowercase** | Consistency across API and user input | `'laranite'` not `'Laranite'` |
| Gem quantities are **individual counts**, not cSCU | Gems don't volume-stack; API provides count | 5 hadanite = 5 gems, not 5 cSCU |
| Quality bands: **500+ / 700+ / 800+ / 900+** (not 500s) | API consistency | "700+" not "700s" or "700-799" |
| `forgex-lots` is always `{lots: [], nextId: N}` | Never a flat array | After re-sync, re-check structure |
| Blueprint UUID is the **stable key** across re-syncs | IDs change per patch; UUIDs don't | Use UUID to preserve tracking flags |
| **Aslarite** is quality-neutral (500+) | Not band-locked like other ingredients | Usable in any tier recipe |
| Hand-mined flag is **read-only** in UI | Set once on creation, never toggled | Gems always hand-mined = true |

### Code Gotchas
| Issue | Solution |
|---|---|
| Ingredients use `quantity_scu` from API, but gems use `quantity` | Check `quantity_scu` first; fall back to `quantity` if null |
| Module 06 (Forge) reads owned list from `forgex-tracking.personal` (bug) | Actually should read `forgex-owned`; TODO for next session |
| Ammunition blueprints hidden in "All" view | Only show when AMMO filter active; exclude from reports |
| localStorage can be cleared by user | All modules re-initialize gracefully to empty state |
| Quality tier calculation ignores Aslarite | Use non-aslarite ingredient avg, not total avg |
| Component buttons disabled until 4.8 API data arrives | Buttons exist but `disabled=true` + tooltip message; no code changes needed |

### Testing Notes
- **No unit tests.** Validation via manual browser testing only.
- **Mock data:** All seed data removed; modules start empty, load from localStorage or API
- **Cross-module:** Changes in Module 09 (Data Sync) affect Module 04/05/06/07 (all read `forgex-blueprints`)
- **Distribution:** Friends only need 12 app files (10 modules + 2 logos). Not `.claude/`, `.git/`, or `SESSION_STATE.md`

---

## Outstanding TODOs for 4.8 Patch

### Blocking
- [ ] Star Citizen Wiki API provides component blueprint data
- [ ] Data Sync parser updated to handle component fields (component_type, component_class, component_grade, component_size)
- [ ] Component buttons enabled (remove `disabled` attribute from all 10 modules)

### High Priority (on API arrival)
- [ ] Test component tracking → order → craft → log workflow
- [ ] Material Needs aggregation with component ingredients
- [ ] Reports 2 & 3 display components correctly

### Medium Priority
- [ ] Module 06 owned IDs fix (read from `forgex-owned`, not `forgex-tracking.personal`)
- [ ] Energy weapon crafting properties (laser/plasma)

### Optional (Post-Launch)
- [ ] Virtual scrolling (if 1500+ blueprints cause lag)
- [ ] Return-to-top button on remaining modules
- [ ] Component material sourcing guide

---

## For the Next Claude

**Workflow:**
1. At session start, pull from GitHub: `git pull origin main` (from live folder)
2. Work in the live folder directly — don't use a worktree
3. Read `SESSION_STATE.md` for recent changes and current blockers
4. When 4.8 patch API arrives, check for component blueprint data
5. Push changes back to GitHub when done

**Quick Checks:**
- Run Data Sync to verify API is reachable
- Check browser console (F12) for any localStorage errors
- All 10 modules should load from iframe shell (Module 01)
- Material Needs defaults to "All" tiers, not "700+"

**Key Contact Points:**
- forgeworks_context.md — System overview (this file)
- SESSION_STATE.md — Session notes, current status, outstanding issues
- forgeworks_datasync.html — API connection; run this first to verify live data
- forgeworks_codex.html — In-app docs for users (also useful for developers)

---

**Happy crafting!** 🛠️

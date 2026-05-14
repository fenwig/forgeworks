# LEGACY CONTEXT — Pre-4.8 System Baseline

**Document Date:** 2026-05-14  
**System Version:** 4.7 (Final)  
**Purpose:** Historical reference for pre-4.8 architecture, data structures, and capabilities

---

## Legacy File Naming

| Current Name | Module | Status |
|---|---|---|
| `forgex_module01_dashboard_v4.html` | Command Dashboard | ✓ |
| `forgex_module02_materials_v2.html` | Material Database | ✓ |
| `forgex_module03_acquisition.html` | Resource Acquisition | ✓ |
| `forgex_module04_v2_full.html` | Blueprint Database | ✓ |
| `forgex_module05_orders.html` | Order Tracker | ✓ |
| `forgex_module06_crafting.html` | The Forge | ✓ |
| `forgex_module07_reports.html` | Reports | ✓ |
| `forgex_module08_ocr.html` | OCR Import | ✓ |
| `forgex_module09_datasync.html` | Data Sync | ✓ |
| `forgex_module10_codex.html` | Codex (In-App Documentation) | ✓ |
| `forgex_crafting_properties.js` | Ballistic weapon properties (DEPRECATED in 4.8) | ✓ |

---

## Legacy Data Model

### Material Lot (Module 02)
```js
{
  id:         number,
  ore:        string,           // lowercase: 'laranite', 'quantainium', etc.
  quality:    number,           // 1–1000
  qty:        number,           // **cSCU (centiscavenged cargo units)**
  location:   string,           // 'Levsky' (note: misspelling in 4.7)
  hand_mined: boolean,          // true = gem, false = ore
  date:       string            // 'YYYY-MM-DD'
}
```

**Key point:** Materials stored in **cSCU**, not SCU. 1 SCU = 100 cSCU.

### Legacy Blueprint Schema (4.7)
```js
{
  id:          number,
  uuid:        string,          // SC Wiki stable UUID
  base:        string,          // 'Aztalan', 'Demeco', 'Vortex'
  slot:        string|null,     // Helmet / Core / Legs / Arms / Backpack (armor only)
  type:        string,          // 'Armor' | 'Weapon' | 'Ammunition' (NO components)
  category:    string|null,     // set manually; not from API
  weight:      string|null,     // Light / Medium / Heavy (armor only)
  finish:      string|null,     // 'Mire', 'Necropolis', etc.
  weapon_type: string|null,     // Sniper Rifle / Pistol / Shotgun / SMG / LMG / etc.
  ammo_type:   string|null,
  capacity:    number|null,
  has_mission: boolean,
  meta:        {},
  ingredients: [{ name: string, qty: number }]  // **qty in cSCU** (NOT SCU)
}
```

**Key differences from 4.8:**
- No `component_type`, `class`, `grade`, `size` fields
- Ingredients in **cSCU**, not SCU
- Only 3 blueprint types (Armor, Weapon, Ammunition)

### Legacy Order Schema (4.7)
```js
{
  id:       number,
  customer: string,
  bpId:     number,
  quality:  number,             // 700 | 800 | 900 (NO 500+)
  status:   string,             // 'inprogress' | 'ready' | 'delivered'
  created:  string,
  deadline: string,
  trade:    string,
  notes:    string
}
```

**Key difference from 4.8:** No `500` quality tier option.

### Legacy Crafting Job (Module 06)
```js
{
  id:           number,
  bpId:         number,
  bpLabel:      string,
  orderId:      number|null,
  crafted:      string,
  qualityTier:  number|null,    // 700 | 800 | 900
  materials: [
    {
      name:           string,
      reqQty:         number,    // **cSCU**
      avgQuality:     number,
      characteristic: string,    // (from crafting_properties.js)
      effectPct:      number|null,
      lotsUsed:       [{ lotId: number, qty_taken: number, quality: number }]
    }
  ]
}
```

---

## Legacy Quality Tiers

**Tracked tiers in 4.7:**
- **700+** (700–799) — gold
- **800+** (800–899) — brighter gold
- **900+** (900–1000) — green (#5a9955)

**NOT tracked:**
- 500+ (500–699) — added in 4.8
- Sub-500 — display only

---

## Legacy Module Capabilities

### Module 01 — Command Dashboard
- Stats cards: Materials, Blueprints (count), Crafts Logged, Orders (status breakdown)
- Module status indicators (all 10 online)
- Navigation sidebar
- No "Return to Top" button
- No "Factory Reset" button

### Module 02 — Material Database
- Add/edit/delete material lots
- Filter by location (dropdown: All or specific location)
- Search by ore name
- Sort by ore/quality/qty/location
- Stats bar: Gems count, Ore SCU (displayed as cSCU)
- No large quantity handling (implicit: works fine up to ~10K cSCU)
- Default location: "Levsky" (misspelled)

### Module 03 — Acquisition
- Add/edit items to acquisition queue
- Filter by location
- Default location: "Levsky"
- Queue max-height: 560px
- No alphabetical sorting

### Module 04 — Blueprint Database
- Filter by type: Armor | Weapon | Ammunition (no Component)
- Quality filter: 700, 800, 900 (no 500+)
- Sort blueprints by base/finish
- Material Needs tab:
  - Tier filter: 700, 800, 900 (default: 700)
  - Shows ingredients in cSCU
  - No gem unit conversion (displays as cSCU)
  - No 500+ filter
  - Font size: 14px
- Tracker detail rows
- No alphabetical sorting
- Can track blueprints (no ownership validation)

### Module 05 — Order Tracker
- Create orders with quality: 700 | 800 | 900 (no 500+)
- Track order status: inprogress → ready → delivered
- Blueprint search (alphabetical)
- Ammunition filtered out
- No alphabetical sorting of blueprint lists

### Module 06 — The Forge (Crafting)
- Blueprint browser (no type filters, just filtered by tracked/order status)
- Select blueprint → view ingredients → allocate from inventory
- Lot picker: select which lots to use for each ingredient
- Craft job tracking + history
- ORDER FULFILLMENT display (redesigned in 4.8 prep)
- Can craft any blueprint (no ownership validation)
- No component support

### Module 07 — Reports
- **Report 1:** (unlabeled, basic stats)
- **Report 2 - Crafting Availability:** Filter by armor/weapon + quality tiers; grouped by set (armor) or individual (weapons)
- **Report 3 - Owned Blueprints:** Same filters
- No component support
- No alphabetical sorting

### Module 08 — OCR Import
- Screenshot OCR parsing (auto-detect ore/quality/qty)
- Auto-correct with fuzzy matching
- Refinery box auto-split into individual lots
- Default location: "Levsky"
- Page alignment: may be centered (left-justify added in 4.8)

### Module 09 — Data Sync
- Fetch blueprints from Star Citizen Wiki API (`/api/v2/blueprints`)
- Parse Armor/Weapon/Ammunition only
- Skip 233 blueprint types (attachments, ship components, liveries, etc.)
- Store in `forgex-blueprints` localStorage
- Sync metadata + log (up to 20 entries)
- No Factory Reset button

### Module 10 — Codex
- 9 collapsible sections (Modules 01–09)
- Anchor nav with jump links
- Full workflow documentation
- No component documentation

---

## Legacy localStorage Schema

| Key | Owner | Format | Notes |
|---|---|---|---|
| `forgex-lots` | Module 02 | `{lots:[...], nextId:N}` | **Always object, never flat array** |
| `forgex-blueprints` | Module 09 | `Blueprint[]` | Flat array; 811 blueprints total (1044 - 233 skipped) |
| `forgex-tracking` | Module 04/05 | `{[bpId]: {personal, order, tiers}}` | personal+order booleans; tiers=number[] |
| `forgex-owned` | Module 04 | `number[]` | Owned blueprint IDs |
| `forgex-active-orders` | Module 05 | `Order[]` | Non-delivered orders only |
| `forgex-crafting-log` | Module 06 | `CraftingJob[]` | Persistent crafting history |
| `forgex-sync-meta` | Module 09 | `{date, gameVersion, count}` | Last sync timestamp + metadata |
| `forgex-sync-log` | Module 09 | `SyncEntry[]` | Up to 20 sync history entries |
| `forgex-locations` | Module 02/03/08 | `string[]` | Custom location names |
| `forgex-default-location` | Module 02/03/08 | `string` | Current default (Levsky if not set) |
| `forgex-forge-preselect` | Module 04 | `string` (bpId) | One-time flag; cleared by Module 06 |

---

## Legacy Known Issues (4.7)

### Resolved This Session (May 12, 2026)
- ~~Mission filter showing only mission blueprints~~ ✓
- ~~NaN values in Material Needs~~ ✓
- ~~has_mission flag set to all blueprints~~ ✓
- ~~Crafted items disappearing from orders~~ ✓ (critical order status bug)

### Open/Deferred in 4.7
1. **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic only; energy weapons pending (deferred indefinitely; removed in 4.8)
2. **Past Orders not persisted** — delivered orders lost on page reload (low priority)
3. **Module 06 owned IDs** — reads from `forgex-tracking.personal` instead of `forgex-owned` (does not affect crafting)
4. **Location misspelling** — "Levsky" should be "Levski" (fixed in 4.8)

---

## Legacy Ingredient Handling Rules

### Gems (Hand-mined)
- Stored as **individual gem counts** (not cSCU)
- Display unit: "gems"
- Examples: hadanite, janalite, dolivine, aphorite, sadaryx, carinite, beradom, jaclium, saldynium, feynmaline, glacosite
- Module 04 Material Needs: displays as cSCU (bug fixed in 4.8)

### Ore (Refined)
- Stored as **cSCU**
- Display unit: "cSCU" (or "SCU" after 4.8 conversion)
- Canonical 27-ore list: quantainium, titanium, laranite, borase, talua, fluorite, tungsten, agricium, aluminum, beryl, copper, gold, platinum, silver, steel, gallium, iodine, magnesium, quartz, silicon, carbon, diamond, hephaestanite, ice, ouratite, riccite, savrilium, tin, torite

### Crafting Properties (DEPRECATED in 4.8)
```js
// forgex_crafting_properties.js — ballistic weapons only
{
  characteristic: "Armor Penetration",
  effect: "Increased penetration vs. armor"
}
```
**Removed entirely in 4.8** — only material name + quality tracked going forward.

---

## Legacy Distribution Workflow

**Scripts (PowerShell):**
- `Collect Updates.ps1` — copies changed files matching `forgex_*.html`, `forgex_*.js`, `*.png` to `Updates to be sent\` folder since last `distributed` git tag
- `Clear Updates.ps1` — empties `Updates to be sent\` folder and advances `distributed` tag

**Files sent to friends:** 12 app files (10 modules + 2 logos)

---

## What Changed in 4.8

### Breaking Changes
1. **File renaming:** `forgex_moduleXX_*` → `forgeworks_*` (10 files)
2. **Data model:** cSCU → SCU natively (fresh start, no migration)
3. **Blueprint types:** Added "ShipComponent" (10 types, 5 classes, 4 grades, 5 sizes)
4. **Quality tiers:** Added 500+ (500–699)
5. **Ingredient handling:** Components in SCU; preserved duplicate ingredients across all types
6. **Crafting properties:** Removed entirely (no characteristics/effects)

### New Features
- Component type filtering (Module 04, 06, 07)
- Class/Grade/Size cascading filters (Module 04, 06)
- 500+ quality tier in orders/tracking
- Factory Reset button (Module 09)
- Return to Top button (Module 01)
- SCU display conversion across all modules
- Unowned blueprint validation (can't track/craft unowned)

### Bug Fixes
- Levski spelling corrected ("Levsky" → "Levski")
- Gems tracking in Material Needs (cSCU conversion)
- Material Needs font size increased
- All lists alphabetically sorted
- OCR page left-justified

---

## Reference: Pre-4.8 Blueprint Example

### Armor Blueprint (Legacy)
```js
{
  id: 1,
  uuid: "abc-123",
  base: "Aztalan",
  slot: "Core",
  type: "Armor",
  weight: "Light",
  finish: "Mire",
  ingredients: [
    { name: "quantainium", qty: 150 },  // cSCU
    { name: "titanium", qty: 75 },       // cSCU
    { name: "laranite", qty: 50 }        // cSCU
  ]
}
```

### Weapon Blueprint (Legacy)
```js
{
  id: 200,
  uuid: "def-456",
  base: "Killshot",
  type: "Weapon",
  weapon_type: "Sniper Rifle",
  finish: "Necropolis",
  ingredients: [
    { name: "laranite", qty: 100 },      // cSCU
    { name: "laranite", qty: 50 },       // cSCU (separate entry, not combined)
    { name: "steel", qty: 25 }           // cSCU
  ]
}
```

---

## Key Architectural Decisions (4.7)

1. **Pure HTML/CSS/JS** — no framework, no build tools, no server
2. **localStorage persistence** — all data local, no cloud sync
3. **cSCU internal storage** — 100 cSCU = 1 SCU (changed to SCU in 4.8)
4. **Module-based UI** — 10 independent modules in iframes
5. **Crafting properties lookup** — ballistic weapons only (removed in 4.8)
6. **No authentication** — single-user tool

---

## For Future Reference

When discussing "the old system" vs. "4.8+":
- **Pre-4.8:** File names had "module" numbers; cSCU storage; quality tiers 700/800/900 only; no components; crafting properties tracked
- **4.8+:** Simplified file names; SCU storage; quality tiers 500/700/800/900; ship components; no crafting properties; fresh start data

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-14  
**Prepared for:** Future reference & historical context

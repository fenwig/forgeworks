# FORGE-X / TI Forgeworks — Project Context

## App Overview

| Field | Value |
|---|---|
| App name (dashboard) | TI Forgeworks — Craft Tracker Suite |
| File prefix | `forgex_` |
| Purpose | Star Citizen 4.7 crafting intelligence system |
| Org | Troublemaker Incorporated — Custom Arms & Armor |
| Target display | 1920×1080 side monitor |
| Stack | Pure HTML / CSS / JS — no build tools, no framework, no server |
| Data persistence | **ALL module data must persist to localStorage.** Currently only cross-module tracking flags and crafting log survive refresh. Retrofit required for Modules 02, 04, 05 before app is production-ready. |
| Data persistence | In-page JS arrays + localStorage for cross-module state (no backend) |

---

## Completed Modules

| File | Title | Status |
|---|---|---|
| `forgex_module01_dashboard_v4.html` | Command Dashboard | ✓ Online |
| `forgex_module02_materials_v2.html` | Material Database | ✓ Online |
| `forgex_module03_acquisition.html` | Resource Acquisition | ✓ Online |
| `forgex_module04_v2_full.html` | Blueprint Database | ✓ Online |
| `forgex_module05_orders.html` | Order Tracker | ✓ Online |
| `forgex_module06_crafting.html` | The Forge | ✓ Online |

## Still to Build

| Future file | Title | Notes |
|---|---|---|
| `forgex_module07_reports.html` | Reports | Activity logs, revenue summaries, analytics |
| `forgex_module08_ocr.html` | OCR Import | Import material lots via OCR scan from in-game screenshots |
| `forgex_module09_datasync.html` | Data Sync | Pull blueprint data from SC Wiki API on patch day |
| (dashboard shell) | iframe Architecture | Module 01 becomes persistent shell; modules 02–09 load in content area |
| `forgex_module06_crafting.html` | Crafting Tracker | Record completed crafts, manage output by quality tier |
| `forgex_module07_forge.html` | The Forge | Craft queue management and production planning |
| `forgex_module08_reports.html` | Reports | Activity logs, revenue summaries, analytics |
| (dashboard shell) | iframe Architecture | Module 01 becomes persistent shell; modules 02–08 load in content area |
| (integrated) | Data Sync | Pull blueprint data from SC Wiki API on patch day — button in dashboard top right |
| (integrated) | OCR Import | Import ore lots via OCR scan — accessible from "Import OCR" button on dashboard |

---

## Frontend Architecture

- **No framework.** Each module is a standalone `.html` file with inline `<style>` and `<script>`.
- **Navigation (current):** Dashboard cards use `onclick="window.location.href='...'` to navigate between modules. No back-navigation exists yet on module pages.
- **Navigation (planned):** Module 01 becomes an iframe shell. The sidebar stays persistent; clicking a nav item loads the target module in an `<iframe>` in the main content area. Modules require no changes to work inside the iframe.
- **Layout:** All modules use `max-width: 960px`, left-aligned, on the dark background. No full-width stretching.
- **Cross-module state:** Two `localStorage` keys bridge Module 05 → Module 04:
  - `forgex-tracking` — `{ [bpId]: { personal: bool, order: bool } }`
  - `forgex-active-orders` — array of active (non-delivered) order objects
- **All other data** (lots, blueprints, orders) is currently hardcoded in JS arrays within each module. Persistence to localStorage for individual modules is a future retrofit task.
- **All other data** (lots, blueprints, orders) is currently hardcoded in JS arrays within each module. Persistence to localStorage for individual modules is a future task.

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
| `--tmi-text-primary` | `#ffffff` | Main readable text — full white |
| `--tmi-text-secondary` | `#d0c4b0` | Supporting text — warm off-white ~80% |
| `--tmi-text-dim` | `#90806e` | Labels, metadata — warm mid-tone ~55% |
| `--tmi-success` | `#5a9955` | Online / ready / crafted |
| `--tmi-warning` | `#cc8800` | Pending / near-deadline |
| `--tmi-danger` | `#cc3333` | Shortage / overdue |
| `--tmi-steel` | `#8a9aaa` | Order badges |

### Typography
| Font | Use |
|---|---|
| Rajdhani | Titles, module names, large labels |
| Share Tech Mono | Data values, badges, monospace UI |
| Exo 2 | Body text, descriptions |

- **Minimum font size:** 14px — applies to every readable/functional text element. Intentional exceptions: badges/pills (9px), eyebrow (10px), section header labels (8–10px Share Tech Mono uppercase).
- **Header eyebrow:** `~10px` Share Tech Mono, gold-dim, uppercase (exception to 14px floor — intentionally small)
- **Module title:** `~20–22px` Rajdhani, bold, **white** (`--tmi-text-primary`) — not gold
- **Minimum font size:** 14px — applies to every text element outside the module header. The blueprint/item name on order cards (`.order-item`, 14px Rajdhani) is the established floor. Anything smaller is a bug to fix on next edit.
- **Header eyebrow:** `~10px` Share Tech Mono, gold-dim, uppercase (exception to 14px floor — intentionally small)
- **Module title:** `~20px` Rajdhani, bold

> **TEXT COLOR RULE — apply on every module edit:**
> Always use the three canonical text tokens. Never hardcode hex text colors.
> - `--tmi-text-primary: #ffffff` — primary readable text (full white)
> - `--tmi-text-secondary: #d0c4b0` — supporting text (warm off-white)
> - `--tmi-text-dim: #90806e` — labels, metadata, placeholders
> When editing any module, update its `:root` vars to these values if they differ.

### Header Pattern (all modules)
```
Troublemaker Incorporated — Custom Arms & Armor   ← eyebrow (small, gold-dim)
[Module Title]                                     ← title (large, Rajdhani, WHITE)
```

### Blueprint Label & Tag Rules
- **Label** (full item name): `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base AmmoType` (ammo)
- **Tag** (type descriptor, shown as a small pill): category only for armor (no slot); "Weapon" for weapons (no weapon_type — already in label); "Ammo · WeaponType" for ammo
- "Finish" is the stylistic name of a blueprint (e.g. "Mire", "Necropolis") — never call it "color"

[Module Title]                                     ← title (large, Rajdhani)
```

### Style Notes
- Clipped polygon buttons: `clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)`
- Sci-fi HUD aesthetic with gold border glows
- Logo: transparent PNG (new files: `large logo.png`, `small logo.png`) — background matches `#0a0804`

---

## Database Schema

### Material Lot (Module 02)
```js
{
  id:         number,
  ore:        string,           // lowercase, e.g. 'laranite'
  quality:    number,           // 1–1000
  qty:        number,           // cSCU
  location:   string,           // e.g. 'Levsky'
  hand_mined: boolean,          // true = gem, false = ore
  date:       string            // 'YYYY-MM-DD'
}
```

### Blueprint (Module 04)
```js
{
  id:          number,
  base:        string,          // e.g. 'Aztalan', 'Demeco'
  slot:        string|null,     // Helmet / Core / Legs / Arms / Backpack (armor only)
  type:        string,          // 'Armor' | 'Weapon' | 'Ammunition'
  category:    string|null,     // Combat / Cosmonaut / Engineer / Environment / Explorer /
                                // Flightsuit / Hunter / Medic / Miner / Racer /
                                // Radiation / Salvager / Stealth / Undersuit
  weight:      string|null,     // Light / Medium / Heavy (armor only)
  finish:      string|null,     // free text, e.g. 'Mire', 'Necropolis' (part of full name)
  finish:      string|null,     // free text, e.g. 'Necropolis' (part of full name)
  weapon_type: string|null,     // Sniper Rifle / Pistol / Shotgun / SMG / LMG /
                                // Energy LMG / Rifle / Energy Assault Rifle /
                                // Energy SMG / Twin Shotgun / Frag Pistol /
                                // Laser Sniper Rifle / Laser Shotgun
  ammo_type:   string|null,
  capacity:    number|null,
  has_mission: boolean,
  ingredients: [{ name: string, qty: number }]  // qty in cSCU
}
```

### Order (Module 05)
```js
{
  id:       number,
  customer: string,             // player handle or name
  bpId:     number,             // references blueprint.id
  qty:      number,             // ⚠️ TO REMOVE — one crafted item per order. Module 05 update deferred.
  qty:      number,             // units ordered
  quality:  number,             // 700 | 800 | 900
  status:   string,             // 'inprogress' | 'ready' | 'delivered'
  created:  string,             // 'YYYY-MM-DD'
  deadline: string,             // 'YYYY-MM-DD' or ''
  price:    number,             // aUEC agreed
  notes:    string
}
```

### Crafting Job (Module 06)
```js
{
  id:           number,
  bpId:         number,         // references blueprint.id
  bpLabel:      string,         // cached display label e.g. 'Corbel Arms Mire'
  orderId:      number|null,    // references order.id — null if personal craft
  crafted:      string,         // 'YYYY-MM-DD'
  qualityTier:  number|null,    // 700 | 800 | 900 — from non-aslarite avg quality
  materials: [
    {
      name:           string,   // ingredient name, e.g. 'laranite'
      reqQty:         number,   // cSCU required by blueprint
      avgQuality:     number,   // weighted avg quality across lots used
      characteristic: string,   // placeholder '—' until SC Wiki API data
      effectPct:      number|null,  // placeholder null until API
      lotsUsed:       [{ lotId: number, qty_taken: number, quality: number }]
    }
  ]
}
```

### localStorage Keys (cross-module)
```js
'forgex-tracking'       // { [bpId]: { personal: bool, order: bool } }
'forgex-active-orders'  // Order[] — active (non-delivered) orders only
'forgex-crafting-log'   // CraftingJob[] — persists across sessions ✓ (Module 06 only persistent module data)
### localStorage Keys (cross-module)
```js
'forgex-tracking'      // { [bpId]: { personal: bool, order: bool } }
'forgex-active-orders' // Order[] — active (non-delivered) orders only
```

---

## Auth Flow

None. This is a local single-user tool with no login, accounts, or server. All data lives in the browser (in-page JS arrays + localStorage). No authentication is planned.

---

## Key Game Mechanics

- **Quality bands:** 700–799, 800–899, 900–1000 for crafted armor/weapons
- **Aslarite:** Universal armor ingredient — usable at quality 500+, not band-locked. Excluded from quality tier calculation but included in characteristic/avg quality display.
- **Hand-mined gems:** Separate tag from mined ore; same inventory system
- **Gem names:** hadanite, janalite, dolvine, aphorite, sadaryx, carinite, beradom, jaclium, saldynium, feynmaline, glacosite
- **Crafting quality tier:** Determined by weighted avg quality of non-aslarite ingredients only

---

## Module 06 — Formula Stub (The Forge)

After clicking MAKE ITEM, display one row per ingredient:

| Material | Avg Quality | Characteristic | Effect |
|---|---|---|---|
| Laranite | 770 | Damage Mitigation | +4.28% |
| Aslarite | 523 | Max / Min Temperature | +0.92% |
| Titanium | 900 | Damage Mitigation | +4.00% |

- **Characteristic** and **Effect %** are placeholders (`—` / `null`) until game data is pulled via SC Wiki API.
- **Avg Quality** = weighted average by qty across all lots used for that ingredient. Example: 2 cSCU @ 800 + 2 cSCU @ 700 = avg 750.
- Aslarite is included in the display but excluded from quality tier calculation.
- Quality tier blocking: MAKE ITEM is only blocked when an order is attached AND the projected tier doesn't match the order's required tier. Personal crafts always go through.
- **Aslarite:** Universal armor ingredient — usable at quality 500+, not band-locked
- **Hand-mined gems:** Separate tag from mined ore; same inventory system
- **Gem names:** hadanite, janalite, dolvine, aphorite, sadaryx, carinite, beradom, jaclium, saldynium, feynmaline, glacosite
- **Crafting quality:** Determined by quality of non-aslarite ingredients at the target band

---

## Star Citizen Wiki API

Endpoint: `https://api.star-citizen.wiki/blueprints`  
Returns: 1,044 blueprints with filtering by output type, class, craft time, ingredients.  
Planned use: One-click refresh on patch day via Data Sync module. Will auto-populate the blueprint array in Module 04.

---

## Outstanding TODOs

### Next session
- [ ] **Module 04 — remaining user changes** (queued) — includes fixing `toggleOwned()` to persist to `forgex-tracking`
- [ ] **Build Module 08 — OCR Import** (`forgex_module08_ocr.html`) — feeds lots into `forgex-lots` in `{lots, nextId}` format
- [ ] Wire up **iframe shell** in Module 01 (persistent header + sidebar)
- [ ] **Module 01** — apply canonical text colors

### Deferred
- [ ] **Remove `qty` from Order form in Module 05** — one crafted item per order
- [ ] **Energy weapon crafting properties** — extract laser/plasma/electron materials from game files (p4k), add to `forgex_crafting_properties.js`
- [ ] **Game dates in seed data** — Modules 02 and 05 use `2954-XX-XX` dates; invisible in date-filtered report views

### Future Expansion
- [ ] **Ship components** in blueprint list (Shield, Powerplant, Radar, Quantum Drive, etc.)
- [ ] SC Wiki API — pull characteristic/effect data if exposed in future API version

---

## Recently Changed Files

| File | What changed |
|---|---|
| `forgex_module09_datasync.html` | NEW — Data Sync module. Fetches ~1,044 blueprints from SC Wiki API; maps to schema; UUID-based tracking preservation across re-syncs; writes forgex-blueprints + forgex-sync-meta. |
| `forgex_crafting_properties.js` | NEW — Static crafting property lookup extracted from game files (p4k v4.7.2). Maps 8 materials to gameplay properties with linear quality formulas. Used by Module 06. |
| `forgex_module04_v2_full.html` | Major update: canonical colors; finish in name label; ammo hidden by default; Target Tier label; 700+/800+/900+ throughout; Crafting Tracker fully rewritten (clickable tier badges, FORGE button, order tier auto-include, per-ingredient tier columns); inventory live from forgex-lots; X button fixed; Material Needs respects selected tiers. |
| `forgex_module06_crafting.html` | FORGE preselect on init; blueprints from forgex-blueprints; ownedIds from forgex-tracking; lots in Module 02 format; crafting properties live; quality tier logic fixed (higher OK for lower order). |
| `forgex_module07_reports.html` | loadLots() fixed for Module 02's {lots,nextId} format (was always returning empty). |
| `forgex_module03_acquisition.html` | commitAll() now actually writes to forgex-lots in {lots,nextId} format; getLocLotCounts() format fix. |
| `forgex_module05_orders.html` | White text scheme; 14px floor; pipeline → In Progress/Ready/Delivered; 1200px width. |
| `forgex_module02_materials_v2.html` | Fully updated — localStorage persistence, locations, combine/split/move, 1200px, canonical colors. Stores forgex-lots as {lots,nextId} object. |

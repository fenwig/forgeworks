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

## Still to Build

| Future file | Title | Notes |
|---|---|---|
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
| `--tmi-text-primary` | `#e8e0d0` | Main readable text |
| `--tmi-text-secondary` | `#b0a890` | Supporting text |
| `--tmi-text-dim` | `#6a6050` | Labels, metadata |
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

- **Minimum font size:** 14px across all non-header UI text
- **Header eyebrow:** `~10px` Share Tech Mono, gold-dim, uppercase
- **Module title:** `~20px` Rajdhani, bold

### Header Pattern (all modules)
```
Troublemaker Incorporated — Custom Arms & Armor   ← eyebrow (small, gold-dim)
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
  qty:      number,             // units ordered
  quality:  number,             // 700 | 800 | 900
  status:   string,             // 'queued' | 'crafting' | 'ready' | 'delivered'
  created:  string,             // 'YYYY-MM-DD'
  deadline: string,             // 'YYYY-MM-DD' or ''
  price:    number,             // aUEC agreed
  notes:    string
}
```

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

### Immediate
- [ ] Apply consistent header branding to **Module 05** (eyebrow still reads "Module 05")
- [ ] Apply consistent header branding to **Module 05** Order Tracker (same pattern as 02–04)

### Near-term
- [ ] Build **Module 06 — Crafting Tracker** (record completed crafts, deduct inventory)
- [ ] Build **Module 07 — The Forge** (craft queue and production planning)
- [ ] Build **Module 08 — Reports** (activity log, revenue, analytics)
- [ ] Wire up **iframe shell** in Module 01 (persistent header + sidebar, modules load in content pane)

### Data & Persistence
- [ ] Persist material lots to localStorage (Module 02 data currently resets on refresh)
- [ ] Persist blueprint tracking + orders across sessions (Module 04/05)
- [ ] **Lot combination** — merge two lots: sum qty, average quality
- [ ] Implement SC Wiki API import for blueprints (Data Sync module)

### Future Expansion
- [ ] **Ship components** in blueprint list:
  - Type: Shield, Powerplant, Radar, Quantum Drive, Cooler, Weapons, Mining Head, Salvage Head
  - Class: Civilian, Industrial, Stealth, Military
  - Tier: A, B, C, D, Entry
  - Size: 1, 2, 3
- [ ] OCR-based ore import (Module 03 currently manual entry only)

---

## Recently Changed Files

| File | What changed |
|---|---|
| `forgex_module04_v2_full.html` | Multi-row context-sensitive filter bar (Type/Category/Slot/Weight/Weapon Type/Finish search); weight + finish added to blueprint schema; branding + font/color consistency |
| `forgex_module03_acquisition.html` | 960px compact layout; font sizes to 14px min; brighter text colors; org name eyebrow |
| `forgex_module02_materials_v2.html` | 960px compact; Notes column removed; font sizes to 14px min; brighter text + quality colors; org name eyebrow; title → "Material Database" |
| `forgex_module01_dashboard_v4.html` | New transparent PNG logos; title → "TI Forgeworks"; removed System Nominal pill; rebuilt module grid (6 cards, correct links); removed Resource Acquisition and Data Sync cards from grid; org stats bar updated |
| `forgex_module05_orders.html` | Fulfillment tab → Past Orders tab; localStorage bridge (forgex-active-orders); order tracking syncs to Module 04; brighter text; 960px compact |
| `large logo.png` | New hero logo with transparent background |
| `small logo.png` | New header corner logo with transparent background |

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
| Data persistence | **ALL module data must persist to localStorage.** Currently only cross-module tracking flags survive refresh. Retrofit required for Modules 02, 04, 05, 06 before app is production-ready. |

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
- **All other data** (lots, blueprints, orders) is currently hardcoded in JS arrays within each module. Persistence to localStorage for individual modules is a future retrofit task.

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
  qty:      number,             // ⚠️ TO REMOVE — one crafted item per order. Module 05 update deferred.
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
  id:        number,
  bpId:      number,            // references blueprint.id
  orderId:   number|null,       // references order.id — null if personal craft
  crafted:   string,            // 'YYYY-MM-DD'
  materials: [
    {
      name:           string,   // ingredient name, e.g. 'laranite'
      req_qty:        number,   // cSCU required by blueprint
      lots_used:      [{ lotId: number, qty_taken: number, quality: number }],
      avg_quality:    number,   // weighted average quality across lots used
      characteristic: string,   // e.g. 'Damage Mitigation' — placeholder until API
      effect_pct:     number|null  // e.g. 4.28 — placeholder until API
    }
  ]
}
```

### localStorage Keys (cross-module)
```js
'forgex-tracking'       // { [bpId]: { personal: bool, order: bool } }
'forgex-active-orders'  // Order[] — active (non-delivered) orders only
'forgex-crafting-log'   // CraftingJob[] — all crafted items, persists across sessions
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

## Module 06 — Formula Stub (Crafting Tracker)

After clicking MAKE ITEM, display one row per ingredient:

| Material | Avg Quality | Characteristic | Effect |
|---|---|---|---|
| Laranite | 770 | Damage Mitigation | +4.28% |
| Aslarite | 523 | Max / Min Temperature | +0.92% |
| Titanium | 900 | Damage Mitigation | +4.00% |

- **Characteristic** and **Effect %** are placeholders until game data is pulled via SC Wiki API.
- **Avg Quality** is calculated: weighted average by qty across all lots used for that ingredient.
  - Example: 2 cSCU @ 800 + 2 cSCU @ 700 = avg quality 750
- Each material type maps to one characteristic (e.g. Laranite → Damage Mitigation). Mapping is per-blueprint and will come from API data.
- Display the stat block in the crafting log entry and on the post-craft result screen.

---

## Star Citizen Wiki API

Endpoint: `https://api.star-citizen.wiki/blueprints`  
Returns: 1,044 blueprints with filtering by output type, class, craft time, ingredients.  
Planned use: One-click refresh on patch day via Data Sync module. Will auto-populate the blueprint array in Module 04.

---

## Outstanding TODOs

### Immediate — next session
- [ ] **Build Module 06 — Crafting Tracker** (`forgex_module06_crafting.html`)
- [ ] **Apply canonical text colors to Modules 01, 02, 03, 04** — update `:root` vars to `#ffffff / #d0c4b0 / #90806e` on next edit of each module

### Near-term
- [ ] Build **Module 07 — The Forge** (craft queue and production planning)
- [ ] Build **Module 08 — Reports** (activity log, revenue, analytics)
- [ ] Wire up **iframe shell** in Module 01 (persistent header + sidebar, modules load in content pane)
- [ ] **Remove `qty` from Order form in Module 05** — one crafted item per order (deferred)

### Data & Persistence ⚠️ ALL MODULE DATA MUST PERSIST
- [ ] Persist material lots to localStorage (Module 02 data resets on refresh)
- [ ] Persist orders across sessions (Module 05)
- [ ] Persist blueprint owned/tracking state (Module 04)
- [ ] Persist crafting log (Module 06 — build with persistence from day one)
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
| `forgex_module05_orders.html` | White text scheme (#ffffff); 14px floor everywhere; pipeline → In Progress/Ready/Delivered; blueprint schema matches Mod 04; getBpLabel() for dropdown; readiness shows only ordered quality tier; Delete Order with confirmation; Revert button; Quality Tier label; 1200px width |
| `forgex_module04_v2_full.html` | Crafting Tracker redesigned to match browser cards (tracked-badge, order pills, readiness bands); card labels fixed (weapon type in bold name, finish→category tags); 1200px width; multi-row filter bar; weight+finish in blueprint schema |
| `forgex_module03_acquisition.html` | 960px compact; 14px fonts; org name eyebrow; old text color scheme |
| `forgex_module02_materials_v2.html` | 960px compact; Notes removed; 14px fonts; org name eyebrow; title → Material Database; old text color scheme |
| `forgex_module01_dashboard_v4.html` | New PNG logos; TI Forgeworks title; rebuilt 6-card grid; old text color scheme |
| `forgexcontext 1.md` | Copied from charming-antonelli worktree; added persistence warning; added Module 06 formula stub; added CraftingJob schema; added qty removal note on Order schema |

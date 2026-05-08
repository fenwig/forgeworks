# FORGE-X / TI Forgeworks — Project Context

## App Overview

| Field | Value |
|---|---|
| App name | TI Forgeworks — Craft Tracker Suite |
| File prefix | `forgex_` |
| Purpose | Star Citizen 4.7 crafting intelligence system |
| Org | TI Forgeworks — Custom Arms & Armor |
| Target display | 1920×1080 side monitor |
| Stack | Pure HTML / CSS / JS — no build tools, no framework, no server |
| Data persistence | All module data persists to localStorage. All modules fully wired. |
| Version control | Local git only — no GitHub remote |

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
| `forgex_module07_reports.html` | Reports | ✓ Online |
| `forgex_module08_ocr.html` | OCR Import | ✓ Online |
| `forgex_module09_datasync.html` | Data Sync | ✓ Online |
| `forgex_crafting_properties.js` | Crafting Properties | ✓ Static lookup (ballistic only) |

---

## Frontend Architecture

- **No framework.** Each module is a standalone `.html` file with inline `<style>` and `<script>`.
- **Navigation:** Module 01 is an iframe shell. Sidebar stays persistent; clicking a nav item loads the target module in an `<iframe>` content area. Modules post messages to trigger cross-frame navigation.
- **Layout:** All modules use `max-width: 1200px`.
- **All module data persists to localStorage.** No hardcoded seed data is used in production — all modules load from localStorage on init, falling back to empty state if no data exists.

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

- **Minimum font size:** 14px floor. Exceptions: badges/pills (9–11px), eyebrow (10px).
- **Header eyebrow:** ~10px Share Tech Mono, gold-dim, uppercase.
- **Module title:** ~20–22px Rajdhani, bold, white (`--tmi-text-primary`) — not gold.

> **TEXT COLOR RULE:** Always use the three canonical text tokens. Never hardcode hex text colors.
> - `--tmi-text-primary: #ffffff`
> - `--tmi-text-secondary: #d0c4b0`
> - `--tmi-text-dim: #90806e`

### Header Pattern (all modules)
```
TI Forgeworks — Custom Arms & Armor   ← eyebrow (small, gold-dim, Share Tech Mono)
[Module Title]                         ← title (large, Rajdhani, WHITE)
```

### Blueprint Label & Tag Rules
- **Label:** `Base Slot Finish` (armor) / `Base WeaponType Finish` (weapon) / `Base AmmoType` (ammo)
- **Tag:** category only for armor (no slot); "Weapon" for weapons; "Ammo · WeaponType" for ammo
- "Finish" is the stylistic name (e.g. "Mire", "Necropolis") — never call it "color"

### Style Notes
- Clipped polygon buttons: `clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)`
- Sci-fi HUD aesthetic with gold border glows
- Logo: transparent PNG (`large logo.png`, `small logo.png`) — background matches `#0a0804`

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

### Blueprint (Module 09 → stored in forgex-blueprints)
```js
{
  id:          number,
  uuid:        string,          // SC Wiki stable UUID — used for tracking preservation across re-syncs
  base:        string,          // e.g. 'Aztalan', 'Demeco'
  slot:        string|null,     // Helmet / Core / Legs / Arms / Backpack (armor only)
  type:        string,          // 'Armor' | 'Weapon' | 'Ammunition'
  category:    string|null,     // set manually in Module 04; not available from API
  weight:      string|null,     // Light / Medium / Heavy (armor only)
  finish:      string|null,     // e.g. 'Mire', 'Necropolis'
  weapon_type: string|null,     // Sniper Rifle / Pistol / Shotgun / SMG / LMG /
                                // Energy LMG / Rifle / Energy Assault Rifle /
                                // Energy SMG / Twin Shotgun / Frag Pistol /
                                // Laser Sniper Rifle / Laser Shotgun
  ammo_type:   string|null,
  capacity:    number|null,
  has_mission: boolean,
  meta:        {},              // future: type-specific API fields for new blueprint types
  ingredients: [{ name: string, qty: number }]  // qty in cSCU
}
```

### Order (Module 05)
```js
{
  id:       number,
  customer: string,             // player handle or name
  bpId:     number,             // references blueprint.id
  quality:  number,             // 700 | 800 | 900
  status:   string,             // 'inprogress' | 'ready' | 'delivered'
  created:  string,             // 'YYYY-MM-DD'
  deadline: string,             // 'YYYY-MM-DD' or ''
  trade:    string,             // free text — aUEC, items, or other terms
  notes:    string
}
```

### Crafting Job (Module 06)
```js
{
  id:           number,
  bpId:         number,
  bpLabel:      string,
  orderId:      number|null,
  crafted:      string,         // 'YYYY-MM-DD'
  qualityTier:  number|null,    // 700 | 800 | 900
  materials: [
    {
      name:           string,
      reqQty:         number,
      avgQuality:     number,
      characteristic: string,
      effectPct:      number|null,
      lotsUsed:       [{ lotId: number, qty_taken: number, quality: number }]
    }
  ]
}
```

### localStorage Keys (full reference)
```js
'forgex-lots'          // { lots: Lot[], nextId: N } — OBJECT, never flat array
'forgex-blueprints'    // Blueprint[] — written by Module 09, read by 04/05/06
'forgex-tracking'      // { [bpId]: { personal: bool, order: bool, tiers: number[] } }
'forgex-owned'         // number[] — array of owned blueprint IDs (independent of tracking)
'forgex-active-orders' // Order[] — active (non-delivered) orders only
'forgex-crafting-log'  // CraftingJob[]
'forgex-sync-meta'     // { date, gameVersion, count }
'forgex-sync-log'      // SyncEntry[] — up to 20 entries with skipped-type breakdown
'forgex-locations'     // string[] — custom location names (shared across modules)
'forgex-forge-preselect' // string (bpId) — one-time flag, cleared by Module 06 on load
'forgex-ocr-region'    // { x, y, w, h } — saved OCR crop region
```

---

## Auth Flow

None. Local single-user tool. No login, no server, no authentication planned.

---

## Key Game Mechanics

- **Quality bands:** 700–799, 800–899, 900–1000 for crafted armor/weapons
- **Aslarite:** Universal armor ingredient — usable at quality 500+, not band-locked. Excluded from quality tier calculation.
- **Hand-mined gems:** hadanite, janalite, dolvine, aphorite, sadaryx, carinite, beradom, jaclium, saldynium, feynmaline, glacosite
- **Crafting quality tier:** Determined by weighted avg quality of non-aslarite ingredients only
- **Refinery box sizes:** 3200 / 1600 / 800 / 400 / 200 / 100 cSCU — filled largest to smallest. OCR import auto-splits yields into individual box lots.

---

## Star Citizen Wiki API

Endpoint: `https://api.star-citizen.wiki/api/v2/blueprints`
Returns: ~1,044 blueprints (Armor / Weapon / Ammunition). Fetched 100/page (~11 requests).

**Armor slot map** — API uses both variants, both must be in ARMOR_SLOT_MAP:
- `Char_Armor_Head` / `Char_Armor_Helmet` → Helmet
- `Char_Armor_Torso` / `Char_Armor_Chest` → Core
- `Char_Armor_Legs` → Legs
- `Char_Armor_Arms` → Arms
- `Char_Armor_Backpack` → Backpack
- `Char_Armor_Undersuit` → null slot

**Ammo:** `WeaponAttachment` with `sub_type: "Magazine"` → Ammunition (not a separate ammo type)

**Future types:** New blueprint types (ship components, weapon attachments, etc.) will park type-specific API fields in `meta: {}`.

---

## Distribution Workflow

- **`Collect Updates.ps1`** — right-click → Run with PowerShell. Copies changed app files (`forgex_*.html`, `forgex_*.js`, `*.png`) to `Updates to be sent\` since last `distributed` git tag.
- **`Clear Updates.ps1`** — empties `Updates to be sent\` and advances the `distributed` tag.
- **Friends** only need the 12 app files — not `.claude/`, `.git/`, `SESSION_STATE.md`, or dev files.
- PowerShell execution policy (one-time): `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## Outstanding TODOs

### Deferred
- [ ] **Energy weapon crafting properties** — `forgex_crafting_properties.js` covers ballistic only. Laser/plasma/electron pending game file extraction.
- [ ] **Past Orders not persisted** — delivered orders lost on page reload (low priority)
- [ ] **Module 04 filter/display for new blueprint types** — hold until a real new type ships in-game

### Future Expansion
- [ ] **Ship components / weapon attachments** — future patch; `meta: {}` bag is ready
- [ ] SC Wiki API — pull characteristic/effect data if exposed in future API version

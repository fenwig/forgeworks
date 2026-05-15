# Forgeworks Architecture Guide

A complete reference for understanding how Forgeworks navigates between modules, passes data, and structures its codebase.

---

## File Structure

**All HTML files are standalone modules loaded into a single iframe shell.**

```
forgeworks_dashboard.html     ← Master shell (always open; never replaced)
├── Header (logo, navigation buttons)
├── Sidebar (module links)
├── Main area (iframe container)
└── #contentFrame (iframe that loads modules)

Modules loaded into #contentFrame (one at a time):
├── forgeworks_materials.html
├── forgeworks_blueprints.html
├── forgeworks_acquisition.html
├── forgeworks_orders.html
├── forgeworks_forge.html
├── forgeworks_reports.html
├── forgeworks_ocr.html
├── forgeworks_datasync.html
└── forgeworks_codex.html
```

**Key point:** The dashboard is the **only persistent page**. When you click "The Forge" or "Reports", the dashboard's iframe `src` is updated to point to that module's HTML file. The dashboard itself stays loaded and waiting for messages.

---

## Navigation System

### How It Works

**Dashboard → Module:**
```javascript
// In forgeworks_dashboard.html
function loadModule(src, navKey) {
  document.getElementById('homeView').style.display = 'none';
  const frame = document.getElementById('contentFrame');
  frame.style.display = 'block';
  frame.src = src;  // ← Sets iframe to module URL
  setActiveNav(navKey || '');  // ← Highlights sidebar button
}
```

When you click a module card or sidebar link:
```html
<div onclick="loadModule('forgeworks_materials.html', 'materials')">
  Material Database
</div>
```

The iframe's `src` is set to the module HTML file. That module loads fresh from disk, initializes, and displays.

**Module → Dashboard or Other Module:**

A module (inside the iframe) can navigate using `postMessage`:
```javascript
// Inside a module (e.g., forgeworks_acquisition.html)
window.parent.postMessage({
  type: 'forgex-navigate',
  src: 'forgeworks_ocr.html'
}, '*');
```

The dashboard listens for this message:
```javascript
// In forgeworks_dashboard.html (line 814)
window.addEventListener('message', e => {
  if(e.data?.type === 'forgex-navigate' && e.data?.src) {
    const navKeys = {
      'forgeworks_ocr.html':         'ocr',
      'forgeworks_acquisition.html': 'acquisition',
      'forgeworks_codex.html':       'codex',
    };
    loadModule(e.data.src, navKeys[e.data.src] || '');
  }
});
```

### Navigation Flow Diagram

```
Dashboard (always loaded)
    ↓
User clicks "Materials" sidebar link
    ↓
loadModule('forgeworks_materials.html', 'materials')
    ↓
#contentFrame.src = 'forgeworks_materials.html'
    ↓
Materials module loads and initializes
    ↓
User clicks "View Acquisition" button in Materials
    ↓
window.parent.postMessage({type: 'forgex-navigate', src: 'forgeworks_acquisition.html'}, '*')
    ↓
Dashboard receives message, calls loadModule('forgeworks_acquisition.html', 'acquisition')
    ↓
#contentFrame.src = 'forgeworks_acquisition.html'
    ↓
Acquisition module loads and initializes
```

---

## Parameter Passing

**Forgeworks does NOT use URL parameters.** Instead, it uses **localStorage as an inter-process communication (IPC) layer** between modules.

### Pattern: localStorage-Based Parameter Passing

**Example 1: Preselecting a Blueprint in The Forge**

In **forgeworks_blueprints.html** (Blueprint Database):
```javascript
// User clicks "Craft This" on a blueprint
function craftThis(bpId) {
  // Store blueprint ID in localStorage
  localStorage.setItem('forgex-forge-preselect', bpId);
  
  // Navigate to Forge module
  window.parent.postMessage({
    type: 'forgex-navigate',
    src: 'forgeworks_forge.html'
  }, '*');
}
```

In **forgeworks_forge.html** (The Forge), on page init:
```javascript
function init() {
  // Check if a blueprint was preselected
  const preselectId = parseInt(localStorage.getItem('forgex-forge-preselect') || '0');
  if (preselectId) {
    // Clear the flag (one-time use)
    localStorage.removeItem('forgex-forge-preselect');
    
    // Find and select the blueprint
    const bp = blueprints.find(b => b.id === preselectId);
    if (bp) craftThis(preselectId);
  }
}
```

**Example 2: Attaching an Order to a Craft Job**

In **forgeworks_orders.html** (Order Tracker):
```javascript
function openForgeForOrder(orderId, bpId) {
  // Store both IDs
  localStorage.setItem('forgex-forge-preselect', bpId);
  localStorage.setItem('forgex-attach-order', orderId);
  
  // Navigate to Forge
  window.parent.postMessage({
    type: 'forgex-navigate',
    src: 'forgeworks_forge.html'
  }, '*');
}
```

In **forgeworks_forge.html**, during init:
```javascript
const preselectId = parseInt(localStorage.getItem('forgex-forge-preselect') || '0');
if (preselectId) {
  localStorage.removeItem('forgex-forge-preselect');
  const bp = blueprints.find(b => b.id === preselectId);
  if (bp) craftThis(preselectId);
  
  // Auto-attach order if present
  const attachOrderId = parseInt(localStorage.getItem('forgex-attach-order') || '0');
  if (attachOrderId) {
    localStorage.removeItem('forgex-attach-order');
    setTimeout(() => {
      attachedOrderId = attachOrderId;
      renderOrderRow();
      renderTierRow();
    }, 100);  // Delay to ensure blueprint is loaded
  }
}
```

### localStorage Keys Used for Parameter Passing

| Key | Purpose | Set By | Read By |
|---|---|---|---|
| `forgex-forge-preselect` | Blueprint ID to pre-select in Forge | Blueprints, Orders | Forge (init) |
| `forgex-attach-order` | Order ID to attach in Forge | Orders | Forge (init) |
| `forgex-default-location` | Global default location | Materials, Acquisition, OCR | Materials, Acquisition, OCR, Forge |

---

## Data Flow: All Data Uses localStorage

All permanent data lives in **browser localStorage** (no backend server).

### localStorage Keys (Complete Reference)

| Key | Module Owner | Type | Purpose |
|---|---|---|---|
| `forgex-lots` | Materials | Object | `{lots: [...], nextId: N}` - Material lot inventory |
| `forgex-blueprints` | Data Sync | Array | ~1,559 blueprints from Star Citizen Wiki API |
| `forgex-tracking` | Blueprints | Object | `{[bpId]: {personal, order, tiers}}` - tracked items |
| `forgex-owned` | Blueprints | Array | Blueprint IDs marked as "Owned" |
| `forgex-active-orders` | Orders | Array | Current orders (delivered orders excluded) |
| `forgex-crafting-log` | Forge | Array | All crafted items (permanent history) |
| `forgex-sync-meta` | Data Sync | Object | Last sync date, game version, blueprint count |
| `forgex-sync-log` | Data Sync | Array | Last 20 sync operations with breakdown |
| `forgex-locations` | Materials/Acquisition | Array | User-defined location names |
| `forgex-default-location` | Materials/Acquisition/OCR | String | Current default location |
| `forgex-ocr-region` | OCR | Object | `{x, y, w, h}` - saved OCR crop area |

### Data Read Pattern

**Every module reads data on init:**
```javascript
function init() {
  // Load from localStorage
  blueprints = loadBlueprints();
  lots = parseLots(localStorage.getItem('forgex-lots'));
  activeOrders = readActiveOrders();
  craftingLog = readLog();
  
  // Initialize UI
  renderUI();
}
```

### Data Write Pattern

**Modules write back to localStorage on mutations:**
```javascript
// When user adds a material lot
function addLot(ore, quality, qty, location) {
  lots.push({id: nextId++, ore, quality, qty, location, date: today});
  
  // Write back to localStorage (preserving {lots, nextId} format)
  const nextId = (parsed?.nextId) || (lots.reduce((m,l) => Math.max(m, l.id), 0) + 1);
  localStorage.setItem('forgex-lots', JSON.stringify({lots, nextId}));
}
```

---

## Module Communication Patterns

### Pattern 1: Navigation Without Data
**Where:** Sidebar clicks, nav buttons
```javascript
// User clicks sidebar link
loadModule('forgeworks_reports.html', 'reports');
```

### Pattern 2: Navigation With Data (localStorage)
**Where:** Blueprints → Forge, Orders → Forge
```javascript
// Store data before navigating
localStorage.setItem('forgex-forge-preselect', bpId);
window.parent.postMessage({
  type: 'forgex-navigate',
  src: 'forgeworks_forge.html'
}, '*');

// Forge reads on init
const bpId = parseInt(localStorage.getItem('forgex-forge-preselect') || '0');
if (bpId) { /* use it */ }
```

### Pattern 3: Global State via localStorage
**Where:** Default location, tracking flags
```javascript
// Set global default
localStorage.setItem('forgex-default-location', 'Levski');

// Read in any module
const DEFAULT_LOC = localStorage.getItem('forgex-default-location') || 'Levski';
```

### Pattern 4: One-Time Flags (Consumed)
**Where:** Forge preselect, order attachment
```javascript
// Write flag
localStorage.setItem('forgex-forge-preselect', bpId);

// Read and immediately delete
const bpId = localStorage.getItem('forgex-forge-preselect');
if (bpId) {
  localStorage.removeItem('forgex-forge-preselect');  // ← Consume
  // Use bpId
}
```

---

## Module Lifecycle

### When a Module Loads

1. **Browser requests:** `#contentFrame.src = 'forgeworks_materials.html'`
2. **HTML parses:** Styles, fonts load
3. **Script executes:** Global variables initialized, functions defined
4. **`init()` called:** Module reads from localStorage, renders UI
5. **User interacts:** Module updates UI and localStorage
6. **User navigates away:** Module is unloaded (memory freed)

### Example: Materials Module Lifecycle

```javascript
// Global state (reinitialized on each load)
let lots = [];
let nextId = 1;

// Read on init
function init() {
  lots = parseLots(localStorage.getItem('forgex-lots'));
  nextId = (parsed?.nextId) || (lots.reduce(...) + 1);
  renderLots();
}

// User interaction
function addLot() {
  lots.push({...});
  localStorage.setItem('forgex-lots', JSON.stringify({lots, nextId}));
  renderLots();
}

// Module unloads when iframe src changes
// All local variables (lots, nextId, UI state) are discarded
```

---

## Example: Full Multi-Module Workflow

**Scenario:** User adds material lot, then crafts a blueprint, then logs it as an order.

### Step 1: Materials Module (User adds ore)
```javascript
// User fills form: ore="laranite", qty=50, quality=750, location="Levski"
function addLot(ore, qty, quality, location) {
  const lot = {id: nextId++, ore, qty, quality, location, date: today};
  lots.push(lot);
  localStorage.setItem('forgex-lots', JSON.stringify({lots, nextId}));
  renderLots();
}
```
✓ Data persisted in localStorage under `forgex-lots`

### Step 2: Blueprints Module (User selects a blueprint to craft)
```javascript
// User clicks "Craft This" on blueprint ID 42
function craftThis(bpId) {
  localStorage.setItem('forgex-forge-preselect', '42');
  window.parent.postMessage({
    type: 'forgex-navigate',
    src: 'forgeworks_forge.html'
  }, '*');
}
```
✓ Blueprint ID stored in localStorage, navigate message sent

### Step 3: Dashboard Receives Navigation Message
```javascript
// Dashboard's message listener
window.addEventListener('message', e => {
  if (e.data?.type === 'forgex-navigate' && e.data?.src === 'forgeworks_forge.html') {
    loadModule('forgeworks_forge.html', 'forge');
  }
});
```

### Step 4: Forge Module (Loads and reads the preselected blueprint)
```javascript
function init() {
  // Read preselect flag
  const preselectId = parseInt(localStorage.getItem('forgex-forge-preselect') || '0');
  if (preselectId) {
    localStorage.removeItem('forgex-forge-preselect');  // Consume flag
    const bp = blueprints.find(b => b.id === preselectId);
    if (bp) craftThis(preselectId);  // Auto-select
  }
  
  // Read lot data (added in step 1)
  lots = parseLots(localStorage.getItem('forgex-lots'));
  
  // Lots are now available for selection in the workbench
  renderSlots();
}

// User selects lots and crafts
function makeItem() {
  // Consume lots, calculate quality, log craft
  const job = {
    id: nextJobId++,
    bpId: selectedBpId,
    orderId: null,
    qualityTier: 750,
    materials: [...]
  };
  craftingLog.unshift(job);
  localStorage.setItem('forgex-crafting-log', JSON.stringify(craftingLog));
}
```
✓ Craft logged in `forgex-crafting-log`

### Step 5: Orders Module (User attaches the craft to an order)
```javascript
// User views crafting log in Orders, clicks "Attach to Order"
function attachCraftToOrder(jobId, orderId) {
  // Find job in crafting log
  const job = JSON.parse(localStorage.getItem('forgex-crafting-log'))[jobId];
  job.orderId = orderId;
  
  // Write back
  localStorage.setItem('forgex-crafting-log', JSON.stringify(craftingLog));
  
  // Update order status
  const orders = JSON.parse(localStorage.getItem('forgex-active-orders'));
  const order = orders.find(o => o.id === orderId);
  order.status = 'delivered';
  localStorage.setItem('forgex-active-orders', JSON.stringify(orders));
}
```
✓ Data updated and persisted

---

## Key Design Principles

1. **Single iframe container:** Dashboard stays loaded; modules swap in and out
2. **localStorage as IPC:** No backend server, no URL parameters
3. **Data consistency:** All modules read and write the same localStorage keys
4. **Lazy loading:** Modules initialize fresh on each load
5. **One-time flags:** Navigation parameters are deleted after use
6. **No module-to-module direct calls:** All communication goes through dashboard via postMessage

---

## Adding a New Feature That Spans Modules

**Example:** Add a "quick craft" button in Blueprints that opens Forge pre-filled with a specific order.

1. **In Blueprints module (forgeworks_blueprints.html):**
   ```javascript
   function quickCraft(bpId, orderId) {
     localStorage.setItem('forgex-forge-preselect', bpId);
     localStorage.setItem('forgex-attach-order', orderId);
     window.parent.postMessage({
       type: 'forgex-navigate',
       src: 'forgeworks_forge.html'
     }, '*');
   }
   ```

2. **In Forge module (forgeworks_forge.html):**
   ```javascript
   // In init()
   const preselectId = parseInt(localStorage.getItem('forgex-forge-preselect') || '0');
   if (preselectId) {
     localStorage.removeItem('forgex-forge-preselect');
     const bp = blueprints.find(b => b.id === preselectId);
     if (bp) craftThis(preselectId);
   }
   
   const attachOrderId = parseInt(localStorage.getItem('forgex-attach-order') || '0');
   if (attachOrderId) {
     localStorage.removeItem('forgex-attach-order');
     attachedOrderId = attachOrderId;
     renderOrderRow();
   }
   ```

3. **In Dashboard (forgeworks_dashboard.html):**
   No changes needed — the postMessage handler already exists

---

## Debugging: Viewing All Data

To inspect all Forgeworks data in browser console:
```javascript
// View all localStorage keys
Object.keys(localStorage).filter(k => k.startsWith('forgex-')).forEach(k => {
  console.log(k, JSON.parse(localStorage.getItem(k)));
});

// Clear all data (destructive!)
Object.keys(localStorage).filter(k => k.startsWith('forgex-')).forEach(k => {
  localStorage.removeItem(k);
});
```

---

## Summary Table: Where Data Lives

| Layer | Technology | Access | Persistence |
|---|---|---|---|
| UI Display | HTML/CSS/JS in iframe | Module reads from localStorage | Rendered each time module loads |
| Active Data | JavaScript variables | Module in-memory | Lost when module unloads |
| Persistent Data | Browser localStorage | All modules (read/write) | Survives page reload, browser restart |
| Navigation | postMessage + DOM | Dashboard iframe container | N/A |

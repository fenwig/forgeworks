// FORGE-X Crafting Properties — extracted from Star Citizen game files (p4k)
// Game version: 4.7.2-LIVE.11674325  |  Extracted: 2026-05-06
// Coverage: All armor (all weights/categories), ballistic weapons (pistol/rifle/SMG/LMG/sniper)
// Not yet extracted: energy weapons (laser/plasma/electron), shotguns
//
// Formula: modifier = modStart + (modEnd - modStart) * clamp((quality - qStart) / (qEnd - qStart), 0, 1)
// Effect % displayed in UI: (modifier - 1) * 100
// "better": "high" = higher modifier is better (damage, mitigation)
//           "low"  = lower modifier is better (recoil — less kick = better)

const CRAFTING_PROPERTIES = {

  _meta: {
    gameVersion: '4.7.2-LIVE.11674325',
    extracted:   '2026-05-06',
    coverage:    'Armor (all weights/categories), Ballistic weapons (pistol/rifle/SMG/LMG/sniper). Energy weapons and shotguns pending.',
    note:        'Ammo blueprints use no property modifiers — quality has no characteristic effect on ammo.'
  },

  // resource_type_uuid (from SC Wiki API) → material name (lowercase)
  // Used to enrich forgex-blueprints ingredient data during Data Sync
  resources: {
    '989f9b73-f636-4f35-a81d-579dcbe3f0ab': 'ouratite',
    'fde0cd65-8827-4b23-804d-cc8845dfa7ac': 'aslarite',
    '392b4dca-449a-4d4d-8fef-beab024d9ee7': 'lindinium',
    '61189578-ed7a-4491-9774-37ae2f82b8b0': 'hephaestanite',
    'f386a33c-ac9a-400a-a7b8-fe1fc7c8d270': 'iron',
    '48c7080a-bbef-43d2-901a-698321ed4340': 'aluminum',
    '06cafea0-49fe-4dce-b0f0-dc583316c66d': 'taranite',
    '4a47cad8-0271-4048-b19b-d9b52521fc20': 'savrilium'
  },

  // material name (lowercase) → array of effect objects
  // Each object: { property, qStart, qEnd, modStart, modEnd, better }
  // For iron: sub-keyed by 'default' and 'sniper' due to different barrel formulas
  effects: {

    // ── ARMOR ─────────────────────────────────────────────────────────────────
    // ARMOURED CARAPACE slot — identical formula heavy/medium/light, all categories
    ouratite: [
      { property: 'Damage Mitigation', qStart: 0, qEnd: 1000, modStart: 0.85, modEnd: 1.15, better: 'high' }
    ],

    // INSULATIVE LINER slot — only active at quality 500+; below 500 = no effect
    aslarite: [
      { property: 'Temperature Min', qStart: 500, qEnd: 1000, modStart: 1.0, modEnd: 1.2, better: 'high' },
      { property: 'Temperature Max', qStart: 500, qEnd: 1000, modStart: 1.0, modEnd: 1.2, better: 'high' }
    ],

    // ── WEAPON FRAME / STOCK / GRIP (all affect recoil identically) ───────────
    // Each weapon type uses a different FRAME material; formula is universal
    aluminum: [   // S-38 Pistol, P4-AR Rifle — FRAME slot
      { property: 'Recoil Smoothness', qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Handling',   qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Kick',       qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' }
    ],
    lindinium: [  // FS-9 LMG — FRAME slot
      { property: 'Recoil Smoothness', qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Handling',   qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Kick',       qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' }
    ],
    savrilium: [  // P8-SC SMG — FRAME slot
      { property: 'Recoil Smoothness', qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Handling',   qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Kick',       qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' }
    ],
    taranite: [   // P6-LR Sniper Rifle — FRAME slot
      { property: 'Recoil Smoothness', qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Handling',   qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Kick',       qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' }
    ],
    hephaestanite: [ // All ballistic weapons — STOCK / GRIP slot
      { property: 'Recoil Smoothness', qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Handling',   qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' },
      { property: 'Recoil Kick',       qStart: 0, qEnd: 1000, modStart: 1.2, modEnd: 0.8, better: 'low' }
    ],

    // ── WEAPON BARREL (Iron) ──────────────────────────────────────────────────
    // Formula differs between sniper and all other ballistic weapon types.
    // Module 06 checks blueprint weapon_type: if it includes 'Sniper' use 'sniper', else 'default'
    iron: {
      default: [   // Pistol, Rifle, LMG, SMG
        { property: 'Damage',    qStart: 0, qEnd: 1000, modStart: 0.925, modEnd: 1.075, better: 'high' },
        { property: 'Fire Rate', qStart: 0, qEnd: 1000, modStart: 0.88,  modEnd: 1.12,  better: 'high' }
      ],
      sniper: [    // Sniper Rifle — no fire rate modifier; tighter damage range
        { property: 'Damage',    qStart: 0, qEnd: 1000, modStart: 0.9,   modEnd: 1.1,   better: 'high' }
      ]
    }

  }

};

// ── Helper: calculate modifier at a given quality ──────────────────────────────
// Returns the raw multiplier (e.g. 1.08 = +8%)
function calcModifier(effectObj, quality) {
  const { qStart, qEnd, modStart, modEnd } = effectObj;
  if (qEnd === qStart) return modStart;
  const t = Math.max(0, Math.min(1, (quality - qStart) / (qEnd - qStart)));
  return modStart + (modEnd - modStart) * t;
}

// ── Helper: get effect entries for a material, respecting weapon type ──────────
// materialName: lowercase string  |  weaponType: blueprint.weapon_type (may be null)
// Returns array of { property, effectPct, better } or [] if no data
function getMaterialEffects(materialName, quality, weaponType) {
  const mat = CRAFTING_PROPERTIES.effects[materialName];
  if (!mat) return [];

  let entries;
  if (mat.default !== undefined) {
    // iron — weapon-type-specific
    const isSniper = weaponType && weaponType.toLowerCase().includes('sniper');
    entries = isSniper ? mat.sniper : mat.default;
  } else {
    entries = mat;
  }

  return entries.map(e => ({
    property:  e.property,
    effectPct: parseFloat(((calcModifier(e, quality) - 1) * 100).toFixed(2)),
    better:    e.better
  }));
}

// ── Part-based characteristics (extracted from game blueprint XML) ─────────────
// This provides accurate part-to-characteristic mappings instead of material-only
const PART_CHARACTERISTICS = {
  'ARMOURED CARAPACE': { property: 'Damage Mitigation', better: 'high' },
  'INSULATIVE LINER': { properties: ['Temperature Min', 'Temperature Max'], better: 'high' },
  'SUPPORT STRUCTURE': { property: 'Damage Mitigation', better: 'high' },
  'FRAME': { properties: ['Recoil Smoothness', 'Recoil Handling', 'Recoil Kick'], better: 'low' },
  'STOCK': { properties: ['Recoil Smoothness', 'Recoil Handling', 'Recoil Kick'], better: 'low' },
  'GRIP': { properties: ['Recoil Smoothness', 'Recoil Handling', 'Recoil Kick'], better: 'low' },
  'BARREL': { properties: ['Damage', 'Fire Rate'], better: 'high' },
  'WIRING': { property: 'Fire Rate', better: 'high' },
  'LENSES': { property: 'Impact Force', better: 'high' }
};

// ── Helper: Get effects for a material+part combination (preferred method) ─────
// part: string (e.g., 'BARREL', 'FRAME')  |  materialName: lowercase string
// quality: number (0-1000)
// Returns array of { property, effectPct, better } or [] if no data
function getMaterialEffectsByPart(part, materialName, quality) {
  // Use part-based characteristics if available
  const partCharacteristics = PART_CHARACTERISTICS[part];
  if (!partCharacteristics) {
    // Fallback to material-only lookup
    return getMaterialEffects(materialName, quality);
  }

  // For now, use the part characteristics without material-specific modifiers
  // In the future, this could be enhanced with more granular part+material→effect mapping
  const properties = partCharacteristics.properties
    ? partCharacteristics.properties
    : [partCharacteristics.property];

  // Fallback: Get actual modifiers from material if available
  const mat = CRAFTING_PROPERTIES.effects[materialName];
  if (mat) {
    let entries;
    if (mat.default !== undefined) {
      const isSniper = false; // weaponType not available here, but FRAME shouldn't be sniper-specific
      entries = mat.default;
    } else {
      entries = mat;
    }
    return entries.map(e => ({
      property:  e.property,
      effectPct: parseFloat(((calcModifier(e, quality) - 1) * 100).toFixed(2)),
      better:    e.better
    }));
  }

  // Generic fallback if no material data
  return properties.map(prop => ({
    property: prop,
    effectPct: 0,
    better: partCharacteristics.better
  }));
}

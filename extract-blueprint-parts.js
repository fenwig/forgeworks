const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Path to extracted game files
const BLUEPRINTS_ROOT = 'D:\\RSI\\StarCitizen\\LIVE\\data\\Libs\\Foundry\\Records\\crafting\\blueprints\\crafting\\fpsgear';

// Track all unique gameplayPropertyRecords and their associated modifiers
const propertyRecords = {};

// Maps: (resource_uuid + part_name) -> [{ property_uuid, modifiers }]
const partResourceToProperties = {};

// Recursive function to find all .xml files
function getAllXmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      files.push(...getAllXmlFiles(itemPath));
    } else if (item.endsWith('.xml') && item.startsWith('bp_craft_')) {
      files.push(itemPath);
    }
  }
  return files;
}

// Parse XML and extract part information
async function parseBlueprint(filePath) {
  const xmlContent = fs.readFileSync(filePath, 'utf8');
  const parser = new xml2js.Parser({
    preserveChildrenOrder: false,
    explicitArray: true
  });
  const result = await parser.parseStringPromise(xmlContent);

  // Find the blueprint record key (should be first property)
  const recordKey = Object.keys(result)[0];
  const record = result[recordKey];

  const blueprint = record?.blueprint?.[0]?.CraftingBlueprint?.[0];
  if (!blueprint) return null;

  const tiers = blueprint.tiers?.[0]?.CraftingBlueprintTier;
  if (!tiers || !Array.isArray(tiers)) return null;

  const tier = tiers[0];
  const recipe = tier.recipe?.[0]?.CraftingRecipe?.[0];
  if (!recipe) return null;

  const costs = recipe.costs?.[0]?.CraftingRecipeCosts?.[0];
  if (!costs) return null;

  const mandatoryCost = costs.mandatoryCost?.[0]?.CraftingCost_Select?.[0];
  if (!mandatoryCost) return null;

  const options = mandatoryCost.options?.[0]?.CraftingCost_Select;
  if (!Array.isArray(options)) return null;

  const parts = [];
  for (const opt of options) {
    const nameInfo = opt.nameInfo?.[0]?.['$'];
    const partName = nameInfo?.debugName || 'UNKNOWN';

    const context = opt.context?.[0]?.CraftingCostContext_ResultGameplayPropertyModifiers?.[0];
    if (!context) continue;

    const gameplayPropertyModifiers = context.gameplayPropertyModifiers?.[0]?.CraftingGameplayPropertyModifiers_List?.[0]?.gameplayPropertyModifiers;
    if (!Array.isArray(gameplayPropertyModifiers)) continue;

    const optionsResources = opt.options?.[0]?.CraftingCost_Resource;
    if (!optionsResources || !Array.isArray(optionsResources) || optionsResources.length === 0) continue;

    const resourceUuid = optionsResources[0]['$']?.resource;
    if (!resourceUuid) continue;

    const propertyUuids = [];
    for (const prop of gameplayPropertyModifiers) {
      // Handle both single and multiple CraftingGameplayPropertyModifierCommon elements
      const propCommons = Array.isArray(prop.CraftingGameplayPropertyModifierCommon)
        ? prop.CraftingGameplayPropertyModifierCommon
        : (prop.CraftingGameplayPropertyModifierCommon ? [prop.CraftingGameplayPropertyModifierCommon] : []);

      for (const propCommon of propCommons) {
        const propUuid = propCommon['$']?.gameplayPropertyRecord;
        const valueRanges = propCommon.valueRanges?.[0]?.CraftingGameplayPropertyModifierValueRange_Linear?.[0]?.['$'];

        if (propUuid) {
          propertyUuids.push({
            uuid: propUuid,
            startQuality: parseInt(valueRanges?.startQuality || 0),
            endQuality: parseInt(valueRanges?.endQuality || 1000),
            modStart: parseFloat(valueRanges?.modifierAtStart || 1),
            modEnd: parseFloat(valueRanges?.modifierAtEnd || 1)
          });

          // Track this property record for later mapping
          if (!propertyRecords[propUuid]) {
            propertyRecords[propUuid] = { count: 0, examples: [] };
          }
          propertyRecords[propUuid].count++;
          if (propertyRecords[propUuid].examples.length < 3) {
            propertyRecords[propUuid].examples.push({ part: partName, file: path.basename(filePath) });
          }
        }
      }
    }

    parts.push({
      name: partName,
      resourceUuid,
      properties: propertyUuids
    });

    // Store the mapping
    const key = `${resourceUuid}|${partName}`;
    if (!partResourceToProperties[key]) {
      partResourceToProperties[key] = propertyUuids;
    }
  }

  return parts;
}

// Main execution
async function main() {
  console.log('Extracting blueprint part data...\n');

  const xmlFiles = getAllXmlFiles(BLUEPRINTS_ROOT);
  console.log(`Found ${xmlFiles.length} blueprint files\n`);

  let processed = 0;
  let withParts = 0;

  for (const file of xmlFiles) {
    try {
      const parts = await parseBlueprint(file);
      if (parts && parts.length > 0) {
        withParts++;
      }
      processed++;
      if (processed % 20 === 0) {
        console.log(`Processed ${processed}/${xmlFiles.length}...`);
      }
    } catch (err) {
      console.error(`Error parsing ${path.basename(file)}: ${err.message}`);
    }
  }

  console.log(`\n✓ Processed ${processed} files`);
  console.log(`✓ Found ${withParts} files with part definitions`);
  console.log(`✓ Found ${Object.keys(propertyRecords).length} unique property records`);
  console.log(`✓ Found ${Object.keys(partResourceToProperties).length} unique part+resource combinations\n`);

  // Output property records for mapping
  console.log('=== PROPERTY RECORDS (UUID -> Property Name) ===\n');
  const sortedProps = Object.entries(propertyRecords)
    .sort((a, b) => b[1].count - a[1].count);

  for (const [uuid, data] of sortedProps) {
    console.log(`${uuid} (${data.count} uses)`);
    for (const ex of data.examples) {
      console.log(`  - ${ex.part} (${ex.file})`);
    }
  }

  console.log('\n=== PART + RESOURCE -> PROPERTIES ===\n');
  const sortedMappings = Object.entries(partResourceToProperties)
    .sort((a, b) => a[0].localeCompare(b[0]));

  for (const [key, props] of sortedMappings) {
    const [resUuid, partName] = key.split('|');
    console.log(`${partName} + ${resUuid}:`);
    for (const p of props) {
      console.log(`  - ${p.uuid} (qual ${p.startQuality}-${p.endQuality}: mod ${p.modStart} → ${p.modEnd})`);
    }
  }

  // Write summary to file
  const summary = {
    timestamp: new Date().toISOString(),
    filesProcessed: processed,
    filesWithParts: withParts,
    uniquePropertyRecords: Object.keys(propertyRecords).length,
    uniquePartCombinations: Object.keys(partResourceToProperties).length,
    propertyRecords,
    partResourceToProperties
  };

  fs.writeFileSync(
    'D:\\Support Files\\Crafting App\\blueprint-parts-mapping.json',
    JSON.stringify(summary, null, 2)
  );
  console.log('\n✓ Mapping saved to blueprint-parts-mapping.json');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

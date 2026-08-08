const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const dataPath = path.join(__dirname, '../../data-export.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function importData() {
  console.log('📥 Importing data to PostgreSQL...');

  // Map table names (snake_case plural) to Prisma model names (camelCase singular)
  const tableToModel = {
    'users': 'user',
    'categories': 'category',
    'products': 'product',
    'social_links': 'socialLink',
    'site_settings': 'siteSettings',
  };

  // Skip _prisma_migrations table
  const tablesToImport = Object.keys(data).filter(table => table !== '_prisma_migrations');

  for (const table of tablesToImport) {
    const modelName = tableToModel[table] || table.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    const model = prisma[modelName];

    if (!model) {
      console.log(`⚠️  Model not found for table: ${table} (tried: ${modelName})`);
      continue;
    }

    if (data[table].length === 0) {
      console.log(`⏭️  Skipping ${table} (no data)`);
      continue;
    }

    console.log(`📥 Importing ${data[table].length} rows to ${table}...`);

    let successCount = 0;
    for (const row of data[table]) {
      try {
        // Product model has no @default(cuid()) on id, so we must keep it
        // Other models have @default(cuid()), so we strip id to let Prisma generate new ones
        const stripId = table !== 'products';
        const { id, createdAt, updatedAt, ...rowData } = row;
        if (!stripId && id) rowData.id = id;

        // Handle date fields
        if (createdAt) rowData.createdAt = new Date(createdAt);
        if (updatedAt) rowData.updatedAt = new Date(updatedAt);

        // Handle JSON fields
        if (rowData.images && typeof rowData.images === 'string') {
          try {
            rowData.images = JSON.parse(rowData.images);
          } catch (e) {
            console.log(`⚠️  Could not parse images for ${table}:`, e.message);
          }
        }

        if (rowData.specifications && typeof rowData.specifications === 'string') {
          try {
            rowData.specifications = JSON.parse(rowData.specifications);
          } catch (e) {
            console.log(`⚠️  Could not parse specifications for ${table}:`, e.message);
          }
        }

        // Convert SQLite integers (0/1) to booleans for known Boolean fields
        const booleanFields = ['isActive', 'heroShowBorder', 'newsletterShowBorder', 'contactShowBorder'];
        for (const field of booleanFields) {
          if (field in rowData && typeof rowData[field] === 'number') {
            rowData[field] = rowData[field] === 1;
          }
        }

        await model.create({ data: rowData });
        successCount++;
      } catch (error) {
        console.error(`❌ Error importing row to ${table}:`, error.message);
        // Continue with next row
      }
    }

    console.log(`✅ Imported ${successCount}/${data[table].length} rows to ${table}`);
  }

  console.log('\n✅ Import complete');
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

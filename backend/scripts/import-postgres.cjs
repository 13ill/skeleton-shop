const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const dataPath = path.join(__dirname, '../../data-export.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function importData() {
  console.log('📥 Importing data to PostgreSQL...');

  // Skip _prisma_migrations table
  const tablesToImport = Object.keys(data).filter(table => table !== '_prisma_migrations');

  for (const table of tablesToImport) {
    const modelName = table.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()); // Convert snake_case to camelCase
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

    for (const row of data[table]) {
      try {
        // Remove SQLite-specific fields if any
        const { id, createdAt, updatedAt, ...rowData } = row;

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

        await model.create({ data: rowData });
      } catch (error) {
        console.error(`❌ Error importing row to ${table}:`, error.message);
        // Continue with next row
      }
    }

    console.log(`✅ Imported ${data[table].length} rows to ${table}`);
  }

  console.log('\n✅ Import complete');
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

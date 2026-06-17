const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read connection string from .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log('🔌 Connecting to Supabase...');

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeSQLFile(filePath, description) {
  console.log(`\n📄 Executing: ${description}`);
  console.log(`📁 File: ${filePath}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await client.query(sql);
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${description}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to Supabase');

    // Test connection
    const result = await client.query('SELECT NOW()');
    console.log(`🕐 Database time: ${result.rows[0].now}`);

    // Execute create-tables.sql
    const createTablesPath = path.join(__dirname, 'create-tables.sql');
    const createSuccess = await executeSQLFile(createTablesPath, 'Create Tables');

    if (!createSuccess) {
      console.error('❌ Failed to create tables. Stopping.');
      await client.end();
      process.exit(1);
    }

    // Execute import-data.sql
    const importDataPath = path.join(__dirname, 'import-data.sql');
    const importSuccess = await executeSQLFile(importDataPath, 'Import Data');

    if (!importSuccess) {
      console.error('❌ Failed to import data. Stopping.');
      await client.end();
      process.exit(1);
    }

    // Verify import
    console.log('\n🔍 Verifying import...');

    const productCount = await client.query("SELECT COUNT(*) as count FROM jump1_products WHERE project = 'jump1'");
    console.log(`✅ Products imported: ${productCount.rows[0].count}`);

    const settingsCount = await client.query("SELECT COUNT(*) as count FROM jump1_site_settings WHERE project = 'jump1'");
    console.log(`✅ Site settings imported: ${settingsCount.rows[0].count}`);

    console.log('\n🎉 All SQL scripts executed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from Supabase');
  }
}

main();

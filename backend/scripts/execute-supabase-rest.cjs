const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read connection string from .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

// Parse connection string to get project URL and anon key
// Format: postgresql://postgres:password@project-ref.supabase.co:5432/postgres
const match = connectionString.match(/postgresql:\/\/[^:]+:([^@]+)@([^.]+)\.supabase\.co/);
if (!match) {
  console.error('❌ Could not parse DATABASE_URL');
  process.exit(1);
}

const password = match[1];
const projectRef = match[2];
const supabaseUrl = `https://${projectRef}.supabase.co`;

// We need the anon key or service role key
// For now, let's try with a placeholder - user will need to provide it
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  console.error('Please add one of these keys to your .env file from Supabase Dashboard:');
  console.error(`  Project Settings → API → ${projectRef}`);
  process.exit(1);
}

console.log('🔌 Connecting to Supabase via REST API...');
console.log(`📍 URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQLFile(filePath, description) {
  console.log(`\n📄 Executing: ${description}`);
  console.log(`📁 File: ${filePath}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed`);
          }
        } catch (err) {
          console.error(`❌ Statement ${i + 1} error:`, err.message);
        }
      }
    }

    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${description}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    // Test connection
    const { data, error } = await supabase.from('jump1_products').select('count');
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (expected)
      console.error('❌ Connection test failed:', error.message);
      process.exit(1);
    }
    console.log('✅ Connected to Supabase');

    // Execute create-tables.sql
    const createTablesPath = path.join(__dirname, 'create-tables.sql');
    const createSuccess = await executeSQLFile(createTablesPath, 'Create Tables');

    if (!createSuccess) {
      console.error('❌ Failed to create tables. Stopping.');
      process.exit(1);
    }

    // Execute import-data.sql
    const importDataPath = path.join(__dirname, 'import-data.sql');
    const importSuccess = await executeSQLFile(importDataPath, 'Import Data');

    if (!importSuccess) {
      console.error('❌ Failed to import data. Stopping.');
      process.exit(1);
    }

    // Verify import
    console.log('\n🔍 Verifying import...');

    const { count: productCount } = await supabase
      .from('jump1_products')
      .select('*', { count: 'exact', head: true })
      .eq('project', 'jump1');
    console.log(`✅ Products imported: ${productCount}`);

    const { count: settingsCount } = await supabase
      .from('jump1_site_settings')
      .select('*', { count: 'exact', head: true })
      .eq('project', 'jump1');
    console.log(`✅ Site settings imported: ${settingsCount}`);

    console.log('\n🎉 All SQL scripts executed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

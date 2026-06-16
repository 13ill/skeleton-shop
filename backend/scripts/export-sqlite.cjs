const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Path to SQLite database
const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

// Get all table names
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('📋 Available tables:', tables.map(t => t.name));

// Export all tables
const data = {};

console.log('\nExporting data from SQLite...');

tables.forEach(tableObj => {
  const table = tableObj.name;
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    data[table] = rows;
    console.log(`✅ Exported ${rows.length} rows from ${table}`);
  } catch (error) {
    console.error(`❌ Error exporting ${table}:`, error.message);
    data[table] = [];
  }
});

// Write to JSON file
const outputPath = path.join(__dirname, '../../data-export.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Data exported to ${outputPath}`);
console.log('📊 Summary:');
Object.keys(data).forEach(table => {
  console.log(`  - ${table}: ${data[table].length} rows`);
});

db.close();

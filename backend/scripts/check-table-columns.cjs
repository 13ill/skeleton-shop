const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '0147',
  database: 'jump1'
});

async function checkColumns() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'jump1_site_settings'
      ORDER BY ordinal_position
    `);

    console.log('📋 Columns in jump1_site_settings:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkColumns();

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '0147',
  database: 'jump1'
});

async function checkData() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check products
    const products = await client.query('SELECT id, name, category FROM jump1_products LIMIT 3');
    console.log('📦 Products:', products.rows);

    // Check tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('📋 Tables:', tables.rows.map(r => r.table_name));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkData();

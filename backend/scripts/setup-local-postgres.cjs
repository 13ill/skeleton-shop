const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '0147',
    database: 'postgres' // Connect to default database first
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create jump1 database
    await client.query('CREATE DATABASE jump1');
    console.log('✅ Database "jump1" created');

    await client.end();
    console.log('✅ Setup complete');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️  Database "jump1" already exists');
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
    await client.end();
  }
}

setupDatabase();

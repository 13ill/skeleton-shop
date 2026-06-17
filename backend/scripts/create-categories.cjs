const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '0147',
  database: 'jump1'
});

async function createCategories() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Get unique categories from products
    const result = await client.query('SELECT DISTINCT category FROM jump1_products WHERE category IS NOT NULL');
    const categories = result.rows.map(r => r.category);

    console.log('📋 Found categories:', categories);

    // Create categories
    for (const cat of categories) {
      const id = crypto.randomUUID();
      const slug = cat.toLowerCase();

      const query = `
        INSERT INTO jump1_categories (id, name, slug, priority, "isActive", project, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO NOTHING
      `;

      await client.query(query, [
        id,
        cat,
        slug,
        1,
        true,
        'jump1',
        new Date().toISOString(),
        new Date().toISOString()
      ]);

      console.log(`✅ Created category: ${cat}`);
    }

    // Update products with categoryId
    for (const cat of categories) {
      const slug = cat.toLowerCase();
      const categoryResult = await client.query('SELECT id FROM jump1_categories WHERE slug = $1', [slug]);
      const categoryId = categoryResult.rows[0].id;

      await client.query(
        'UPDATE jump1_products SET "categoryId" = $1 WHERE category = $2',
        [categoryId, cat]
      );

      console.log(`✅ Updated products for category: ${cat}`);
    }

    console.log('✅ Categories created and products updated');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createCategories();

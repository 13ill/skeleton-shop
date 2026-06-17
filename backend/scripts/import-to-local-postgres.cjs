const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '0147',
  database: 'jump1'
});

async function importData() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Read exported data
    const dataPath = path.join(__dirname, '../../data-export.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Import products
    if (data.products && data.products.length > 0) {
      console.log(`📦 Importing ${data.products.length} products...`);

      for (const p of data.products) {
        const query = `
          INSERT INTO jump1_products (id, name, category, "categoryId", "globalOrder", "categoryOrder", price, description, "fullDescription", material, specifications, images, project, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING
        `;

        await client.query(query, [
          p.id,
          p.name,
          p.category,
          p.categoryId,
          p.globalOrder,
          p.categoryOrder,
          p.price,
          p.description,
          p.fullDescription,
          p.material,
          p.specifications ? JSON.stringify(p.specifications) : null,
          p.images ? JSON.stringify(p.images) : '[]',
          'jump1',
          p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
          p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString()
        ]);
      }

      console.log('✅ Products imported');
    }

    // Import site settings
    if (data.site_settings && data.site_settings.length > 0) {
      console.log('⚙️  Importing site settings...');

      const s = data.site_settings[0];
      const query = `
        INSERT INTO jump1_site_settings (id, "brandName", tagline, address, "openingHours", phone, email, project, "heroTitle", "heroSubtitle", "heroButtonText", "heroBackgroundImage", "heroTextStrokeColor", "heroTextStrokeWidth", "heroBorderColor", "heroShowBorder", "newsletterTitle", "newsletterDescription", "newsletterBackgroundImage", "newsletterTextStrokeColor", "newsletterTextStrokeWidth", "newsletterBorderColor", "newsletterShowBorder", "contactPageTitle", "contactPageDescription", "contactBackgroundImage", "contactTextStrokeColor", "contactTextStrokeWidth", "contactBorderColor", "contactShowBorder", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
        ON CONFLICT DO NOTHING
      `;

      await client.query(query, [
        crypto.randomUUID(),
        s.brandName || 'Niwelry',
        s.tagline,
        s.address,
        s.openingHours,
        s.phone,
        s.email,
        'jump1',
        s.heroTitle,
        s.heroSubtitle,
        s.heroButtonText,
        s.heroBackgroundImage,
        s.heroTextStrokeColor,
        s.heroTextStrokeWidth || 0.5,
        s.heroBorderColor,
        s.heroShowBorder === 1 || s.heroShowBorder === true,
        s.newsletterTitle,
        s.newsletterDescription,
        s.newsletterBackgroundImage,
        s.newsletterTextStrokeColor,
        s.newsletterTextStrokeWidth || 0.5,
        s.newsletterBorderColor,
        s.newsletterShowBorder === 1 || s.newsletterShowBorder === true,
        s.contactPageTitle,
        s.contactPageDescription,
        s.contactBackgroundImage,
        s.contactTextStrokeColor,
        s.contactTextStrokeWidth || 0.5,
        s.contactBorderColor,
        s.contactShowBorder === 1 || s.contactShowBorder === true,
        s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
        s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString()
      ]);

      console.log('✅ Site settings imported');
    }

    // Verify import
    const productCount = await client.query("SELECT COUNT(*) as count FROM jump1_products WHERE project = 'jump1'");
    console.log(`📊 Products in database: ${productCount.rows[0].count}`);

    const settingsCount = await client.query("SELECT COUNT(*) as count FROM jump1_site_settings WHERE project = 'jump1'");
    console.log(`📊 Site settings in database: ${settingsCount.rows[0].count}`);

    console.log('✅ Import complete');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

importData();

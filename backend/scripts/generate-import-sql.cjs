const fs = require('fs');
const path = require('path');

// Read exported data
const dataPath = path.join(__dirname, '../../data-export.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper function to escape SQL strings
function escapeString(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'true' : 'false';
  if (typeof str === 'number') {
    // Handle integer 0/1 as boolean for boolean fields
    return str;
  }
  if (typeof str === 'object') {
    // Handle JSON objects/arrays
    return "'" + JSON.stringify(str).replace(/'/g, "''") + "'";
  }
  // Handle strings
  return "'" + String(str).replace(/'/g, "''").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n') + "'";
}

// Helper function to convert camelCase to snake_case
function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// Generate SQL for products
let sql = '-- Import data to Jump-1 tables in Supabase SQL Editor\n';
sql += '-- Generated from SQLite export\n\n';

// Import products
if (data.products && data.products.length > 0) {
  sql += '-- Import products\n';
  sql += 'INSERT INTO jump1_products (id, name, category, category_id, global_order, category_order, price, description, full_description, material, specifications, images, project, created_at, updated_at)\n';
  sql += 'VALUES\n';
  
  const productValues = data.products.map((p, index) => {
    const values = [
      escapeString(p.id),
      escapeString(p.name),
      escapeString(p.category),
      escapeString(p.categoryId),
      escapeString(p.globalOrder),
      escapeString(p.categoryOrder),
      escapeString(p.price),
      escapeString(p.description),
      escapeString(p.fullDescription),
      escapeString(p.material),
      escapeString(p.specifications),
      escapeString(p.images),
      "'jump1'",
      escapeString(p.createdAt ? new Date(p.createdAt).toISOString() : null),
      escapeString(p.updatedAt ? new Date(p.updatedAt).toISOString() : null)
    ];
    return `  (${values.join(', ')})${index < data.products.length - 1 ? ',' : ''}`;
  });
  
  sql += productValues.join('\n');
  sql += ' ON CONFLICT (id) DO NOTHING;\n\n';
}

// Import site settings
if (data.site_settings && data.site_settings.length > 0) {
  sql += '-- Import site settings\n';
  const s = data.site_settings[0];
  
  const columns = [
    'id', 'brand_name', 'tagline', 'address', 'opening_hours', 'phone', 'email', 'project',
    'hero_title', 'hero_subtitle', 'hero_button_text', 'hero_background_image',
    'hero_text_stroke_color', 'hero_text_stroke_width', 'hero_border_color', 'hero_show_border',
    'newsletter_title', 'newsletter_description', 'newsletter_background_image',
    'newsletter_text_stroke_color', 'newsletter_text_stroke_width', 'newsletter_border_color', 'newsletter_show_border',
    'contact_page_title', 'contact_page_description', 'contact_background_image',
    'contact_text_stroke_color', 'contact_text_stroke_width', 'contact_border_color', 'contact_show_border'
  ];
  
  const values = [
    'gen_random_uuid()',
    escapeString(s.brandName),
    escapeString(s.tagline),
    escapeString(s.address),
    escapeString(s.openingHours),
    escapeString(s.phone),
    escapeString(s.email),
    "'jump1'",
    escapeString(s.heroTitle),
    escapeString(s.heroSubtitle),
    escapeString(s.heroButtonText),
    escapeString(s.heroBackgroundImage),
    escapeString(s.heroTextStrokeColor),
    escapeString(s.heroTextStrokeWidth),
    escapeString(s.heroBorderColor),
    s.heroShowBorder === 1 || s.heroShowBorder === true ? 'true' : 'false',
    escapeString(s.newsletterTitle),
    escapeString(s.newsletterDescription),
    escapeString(s.newsletterBackgroundImage),
    escapeString(s.newsletterTextStrokeColor),
    escapeString(s.newsletterTextStrokeWidth),
    escapeString(s.newsletterBorderColor),
    s.newsletterShowBorder === 1 || s.newsletterShowBorder === true ? 'true' : 'false',
    escapeString(s.contactPageTitle),
    escapeString(s.contactPageDescription),
    escapeString(s.contactBackgroundImage),
    escapeString(s.contactTextStrokeColor),
    escapeString(s.contactTextStrokeWidth),
    escapeString(s.contactBorderColor),
    s.contactShowBorder === 1 || s.contactShowBorder === true ? 'true' : 'false'
  ];
  
  sql += 'INSERT INTO jump1_site_settings (' + columns.join(', ') + ')\n';
  sql += 'VALUES\n';
  sql += '  (' + values.join(', ') + ')\n';
  sql += 'ON CONFLICT DO NOTHING;\n\n';
}

// Verify import
sql += '-- Verify import\n';
sql += "SELECT 'Products imported:' as status, COUNT(*) as count FROM jump1_products WHERE project = 'jump1';\n";
sql += "SELECT 'Site settings imported:' as status, COUNT(*) as count FROM jump1_site_settings WHERE project = 'jump1';\n";

// Write to file
const outputPath = path.join(__dirname, 'import-data.sql');
fs.writeFileSync(outputPath, sql);

console.log('✅ SQL import script generated:', outputPath);
console.log('📊 Summary:');
console.log('  - Products:', data.products.length);
console.log('  - Site settings:', data.site_settings.length);

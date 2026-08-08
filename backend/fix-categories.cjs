// Create categories and link products to them
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fixCategories() {
  console.log('🔧 Creating categories and linking products...\n');
  
  // Get unique categories from products
  const products = await p.product.findMany({ select: { id: true, category: true } });
  const uniqueSlugs = [...new Set(products.map(pr => pr.category))];
  console.log('Found category slugs:', uniqueSlugs);
  
  // Category display names (Thai)
  const categoryNameMap = {
    'ring': 'แหวน',
    'earring': 'ต่างหู',
    'necklace': 'สร้อยคอ',
    'bracelet': 'สร้อยข้อมือ',
    'pendant': 'จี้',
  };
  
  // Create categories
  for (const slug of uniqueSlugs) {
    const existing = await p.category.findUnique({ where: { slug } });
    if (existing) {
      console.log(`✓ Category "${slug}" already exists (id: ${existing.id})`);
      continue;
    }
    const created = await p.category.create({
      data: {
        name: categoryNameMap[slug] || slug,
        slug: slug,
        priority: 1,
        isActive: true,
        project: 'jump1',
      }
    });
    console.log(`✅ Created category "${slug}" (id: ${created.id})`);
  }
  
  // Link products to categories
  const categories = await p.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));
  
  let linked = 0;
  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (categoryId) {
      await p.product.update({
        where: { id: product.id },
        data: { categoryId }
      });
      linked++;
      console.log(`✅ Linked product ${product.id} → category ${product.category}`);
    }
  }
  
  console.log(`\n✅ Done! Linked ${linked}/${products.length} products to categories`);
  
  // Verify
  const count = await p.product.count({ where: { NOT: { categoryId: null } } });
  console.log(`Products with categoryId: ${count}`);
  
  await p.$disconnect();
}

fixCategories().catch(e => { console.error('Error:', e); process.exit(1); });

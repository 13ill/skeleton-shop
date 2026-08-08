const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
  const products = await p.product.findMany({ select: { id: true, name: true, category: true, categoryId: true } });
  console.log('Products:');
  console.log(JSON.stringify(products, null, 2));
  
  const categories = await p.category.findMany();
  console.log('\nCategories:');
  console.log(JSON.stringify(categories, null, 2));
  
  await p.$disconnect();
}

check().catch(e => { console.error('Error:', e.message); process.exit(1); });

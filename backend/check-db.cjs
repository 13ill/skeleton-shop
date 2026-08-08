const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
  const productCount = await p.product.count();
  console.log('Products in DB:', productCount);
  const categoryCount = await p.category.count();
  console.log('Categories in DB:', categoryCount);
  const settingsCount = await p.siteSettings.count();
  console.log('SiteSettings in DB:', settingsCount);
  await p.$disconnect();
}

check().catch(e => { console.error('Error:', e.message); process.exit(1); });

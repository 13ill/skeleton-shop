/**
 * Restore script — อ่านไฟล์ backup JSON แล้ว insert กลับเข้า DB
 * รัน: npx tsx scripts/restore.ts backups/backup-supabase-{timestamp}.json
 *
 * ⚠️ คำเตือน: restore จะลบข้อมูลเดิมก่อน insert ใหม่
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const backupFile = process.argv[2];

  if (!backupFile) {
    console.error('❌ กรุณาระบุไฟล์ backup');
    console.log('   วิธีใช้: npx tsx scripts/restore.ts backups/backup-supabase-20260808-22-22-33.json');
    process.exit(1);
  }

  if (!existsSync(backupFile)) {
    console.error(`❌ ไม่พบไฟล์: ${backupFile}`);
    process.exit(1);
  }

  console.log(`\n🔄 Restore started at ${new Date().toISOString()}`);
  console.log(`   File: ${backupFile}\n`);

  const backup = JSON.parse(readFileSync(backupFile, 'utf-8'));

  // ลบข้อมูลเดิม (เรียงตาม foreign key dependencies)
  console.log('   Clearing existing data...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();
  console.log('   ✓ Cleared\n');

  // Restore ตามลำดับ (parents ก่อน children)
  // 1. Users
  if (backup.users?.length) {
    console.log(`   Restoring users (${backup.users.length} rows)...`);
    for (const row of backup.users) {
      await prisma.user.create({ data: row });
    }
    console.log('   ✓ users');
  }

  // 2. Categories
  if (backup.categories?.length) {
    console.log(`   Restoring categories (${backup.categories.length} rows)...`);
    for (const row of backup.categories) {
      // แยก products ออก (restore แยกทีหลัง)
      const { products, ...categoryData } = row;
      await prisma.category.create({ data: categoryData });
    }
    console.log('   ✓ categories');
  }

  // 3. Products
  if (backup.products?.length) {
    console.log(`   Restoring products (${backup.products.length} rows)...`);
    for (const row of backup.products) {
      await prisma.product.create({ data: row });
    }
    console.log('   ✓ products');
  }

  // 4. SocialLinks
  if (backup.socialLinks?.length) {
    console.log(`   Restoring socialLinks (${backup.socialLinks.length} rows)...`);
    for (const row of backup.socialLinks) {
      await prisma.socialLink.create({ data: row });
    }
    console.log('   ✓ socialLinks');
  }

  // 5. SiteSettings
  if (backup.siteSettings?.length) {
    console.log(`   Restoring siteSettings (${backup.siteSettings.length} rows)...`);
    for (const row of backup.siteSettings) {
      await prisma.siteSettings.create({ data: row });
    }
    console.log('   ✓ siteSettings');
  }

  console.log('\n✅ Restore completed!\n');
}

main()
  .catch((error) => {
    console.error('\n❌ Restore failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Backup script — ดึงข้อมูลทั้งหมดจาก Supabase (PostgreSQL) ผ่าน Prisma
 * รัน: npx tsx scripts/backup.ts
 *
 * ผลลัพธ์: backups/backup-supabase-{timestamp}.json
 *   - ข้อมูลทุก table ในรูปแบบ JSON
 *   - ใช้ restore ได้ด้วย scripts/restore.ts
 */
import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = join(process.cwd(), 'backups');

  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = join(backupDir, `backup-supabase-${timestamp}.json`);
  const dbUrl = process.env.DATABASE_URL || '';

  // ตรวจสอบว่าเป็น Supabase หรือ local
  const isSupabase = dbUrl.includes('supabase.co');
  console.log(`\n📦 Backup started at ${new Date().toISOString()}`);
  console.log(`   Database: ${isSupabase ? 'Supabase (Production)' : 'Local PostgreSQL'}`);
  console.log(`   Output: ${backupFile}\n`);

  const backup: Record<string, any> = {
    _meta: {
      timestamp: new Date().toISOString(),
      database: isSupabase ? 'supabase' : 'local',
      url: dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'), // ซ่อน password
    },
  };

  // ดึงข้อมูลทุก table
  const tables = [
    { name: 'users', fetch: () => prisma.user.findMany() },
    { name: 'categories', fetch: () => prisma.category.findMany({ include: { products: true } }) },
    { name: 'products', fetch: () => prisma.product.findMany() },
    { name: 'socialLinks', fetch: () => prisma.socialLink.findMany() },
    { name: 'siteSettings', fetch: () => prisma.siteSettings.findMany() },
  ];

  let totalRows = 0;

  for (const table of tables) {
    try {
      console.log(`   Fetching ${table.name}...`);
      const data = await table.fetch();
      backup[table.name] = data;
      totalRows += Array.isArray(data) ? data.length : (data ? 1 : 0);
      console.log(`   ✓ ${table.name}: ${Array.isArray(data) ? data.length : (data ? 1 : 0)} rows`);
    } catch (error) {
      console.error(`   ✗ ${table.name}: ${error instanceof Error ? error.message : String(error)}`);
      backup[table.name] = null;
      backup._meta.errors = backup._meta.errors || [];
      backup._meta.errors.push({ table: table.name, error: String(error) });
    }
  }

  // เขียนไฟล์ JSON
  const json = JSON.stringify(backup, null, 2);
  writeFileSync(backupFile, json, 'utf-8');

  const sizeKB = (Buffer.byteLength(json) / 1024).toFixed(2);
  console.log(`\n✅ Backup completed!`);
  console.log(`   File: ${backupFile}`);
  console.log(`   Size: ${sizeKB} KB`);
  console.log(`   Total rows: ${totalRows}`);
  console.log(`   Tables: ${tables.map(t => t.name).join(', ')}\n`);

  // สร้างไฟล์สรุปสั้น
  const summaryFile = join(backupDir, `backup-supabase-${timestamp}.summary.txt`);
  const summary = [
    `Backup Summary — ${new Date().toISOString()}`,
    `Database: ${isSupabase ? 'Supabase (Production)' : 'Local PostgreSQL'}`,
    `File: ${backupFile}`,
    `Size: ${sizeKB} KB`,
    `Total rows: ${totalRows}`,
    '',
    'Tables:',
    ...tables.map(t => `  ${t.name}: ${Array.isArray(backup[t.name]) ? backup[t.name].length : (backup[t.name] ? 1 : 0)} rows`),
    '',
    `Restore: npx tsx scripts/restore.ts ${backupFile}`,
  ].join('\n');
  writeFileSync(summaryFile, summary, 'utf-8');
  console.log(`   Summary: ${summaryFile}`);
}

main()
  .catch((error) => {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

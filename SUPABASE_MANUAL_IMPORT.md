# Supabase Manual Import Instructions

เนื่องจาก Prisma migration มีปัญหาการเชื่อมต่อ (P1001 error) เราจะใช้วิธี manual ผ่าน Supabase SQL Editor แทน

## ขั้นตอนการ Execute SQL Scripts

### 1. เข้าสู่ Supabase SQL Editor
- เปิด browser ไปที่: https://supabase.com/dashboard/project/nnhohnfjmzarkopoebqr/sql
- หรือจาก Supabase Dashboard → SQL Editor

### 2. Execute create-tables.sql
- เปิดไฟล์: `backend/scripts/create-tables.sql`
- Copy เนื้อหาทั้งหมด
- Paste ลงใน Supabase SQL Editor
- กดปุ่ม **Run** (หรือ Ctrl+Enter)
- ตรวจสอบว่าไม่มี error และแสดง "Jump-1 tables created successfully!"

### 3. Execute import-data.sql
- เปิดไฟล์: `backend/scripts/import-data.sql`
- Copy เนื้อหาทั้งหมด
- Paste ลงใน Supabase SQL Editor
- กดปุ่ม **Run** (หรือ Ctrl+Enter)
- ตรวจสอบว่า import สำเร็จและแสดงจำนวน rows ที่ import แล้ว

### 4. ตรวจสอบข้อมูล
ใน Supabase SQL Editor ให้ run queries เหล่านี้เพื่อ verify:

```sql
-- Check products
SELECT COUNT(*) FROM jump1_products WHERE project = 'jump1';

-- Check site settings
SELECT COUNT(*) FROM jump1_site_settings WHERE project = 'jump1';

-- View sample product
SELECT id, name, category FROM jump1_products LIMIT 1;

-- View site settings
SELECT brand_name, tagline FROM jump1_site_settings;
```

## ข้อมูลที่จะถูก Import

- **Products**: 6 rows (GEM1, gem2, gem3, gem4, gem5, gem6)
- **Site Settings**: 1 row (Niwelry brand settings)
- **Users**: 0 rows (ไม่มีข้อมูลใน SQLite)
- **Categories**: 0 rows (ไม่มีข้อมูลใน SQLite)
- **Social Links**: 0 rows (ไม่มีข้อมูลใน SQLite)

## หลังจาก Import สำเร็จ

หลังจาก execute SQL scripts และ verify ข้อมูลแล้ว ให้แจ้งให้ฉันทราบเพื่อ:
1. Update backend `.env` ด้วย Supabase connection string
2. Test backend connection กับ Supabase
3. Update PHASE1_STATUS.md

## หมายเหตุ

- ทุก table มี prefix `jump1_` เพื่อ avoid conflicts กับ POS project
- ทุก row มี `project = 'jump1'` เพื่อ multi-tenancy support
- ใช้ `ON CONFLICT DO NOTHING` เพื่อ avoid duplicate errors

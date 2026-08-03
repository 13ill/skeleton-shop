# Migration Guide: PostgreSQL (Supabase) → MySQL (hostatom)

> ใช้เมื่อย้าย Jump-1 backend จาก Render + Supabase → hostatom
> เผื่อไว้กรณี: Supabase เก็บเงิน, อยากรวม DB ที่เดียว, อยากย้ายทั้งหมดไป hostatom

---

## 📋 สถานการณ์ที่ใช้คู่มือนี้

- ตอนนี้: Jump-1 รันบน Render + Supabase (PostgreSQL)
- อนาคต: ย้ายไป hostatom (MySQL)
- ข้อมูล: มี `data-export.json` เป็น backup ครบ

---

## 🔄 ขั้นตอนการย้าย (30 นาที)

### ขั้นที่ 1: สำรอง schema เดิม

```bash
cd backend/prisma
cp schema.prisma schema.postgresql.prisma
```

### ขั้นที่ 2: สลับไปใช้ MySQL schema

```bash
# ใช้ schema.mysql.prisma ที่เตรียมไว้แล้ว
cp schema.mysql.prisma schema.prisma

# ตรวจว่า provider เปลี่ยนแล้ว
head -12 schema.prisma
# ควรเห็น: provider = "mysql"
```

### ขั้นที่ 3: สร้าง MySQL database บน hostatom

1. เข้า cPanel → MySQL Databases
2. สร้าง database: `ร้าน_jump1`
3. สร้าง user + password
4. Add user to database (All Privileges)
5. คัดลอก connection string:
   ```
   mysql://ร้าน_jump1_user:<password>@localhost:3306/ร้าน_jump1
   ```

### ขั้นที่ 4: รัน migration บน MySQL

```bash
cd backend

# ตั้ง DATABASE_URL เป็น MySQL
$env:DATABASE_URL = "mysql://ร้าน_jump1_user:<password>@localhost:3306/ร้าน_jump1"

# สร้าง tables
npx prisma migrate dev --name init_mysql
```

### ขั้นที่ 5: Import ข้อมูล

```bash
# ใช้ script เดิม (รองรับทั้ง PostgreSQL และ MySQL)
node scripts/import-postgres.cjs
```

> **หมายเหตุ:** script ใช้ Prisma Client ซึ่งรองรับ MySQL ได้โดยตรง
> ข้อมูลมาจาก `data-export.json` ที่เก็บไว้ใน repo

### ขั้นที่ 6: ตรวจสอบ

```bash
# นับจำนวนสินค้า
npx prisma studio
# หรือไป cPanel → phpMyAdmin → ดูตาราง jump1_products
```

### ขั้นที่ 7: อัปเดต backend env

ใน hostatom cPanel → Setup Node.js App:
```env
DATABASE_URL=mysql://ร้าน_jump1_user:<password>@localhost:3306/ร้าน_jump1
NODE_ENV=production
R2_ENDPOINT=... (เดิม)
R2_ACCESS_KEY_ID=... (เดิม)
R2_SECRET_ACCESS_KEY=... (เดิม)
R2_BUCKET_NAME=jump-1-images
R2_PUBLIC_URL=... (เดิม)
JWT_SECRET=... (เดิม)
```

### ขั้นที่ 8: อัปเดต frontend

ใน Cloudflare Pages → Environment variables:
```
VITE_API_BASE_URL = https://api-jump1.ร้าน.com
```
Rebuild → deploy ใหม่

---

## ⚠️ ความแตกต่าง PostgreSQL vs MySQL

| จุด | PostgreSQL | MySQL |
|-----|-----------|-------|
| Connection string | `postgresql://...` | `mysql://...` |
| Port | 5432 | 3306 |
| JSON type | `Json` (native) | `Json` (MySQL 5.7+) |
| String length | ไม่จำกัด | `@db.VarChar(255)`, `@db.Text`, `@db.LongText` |
| Case sensitive | ใช่ | ขึ้นกับ collation (utf8mb4_unicode_ci = ไม่ sensitive) |
| Boolean | `true`/`false` | `1`/`0` (Prisma แปลงให้) |

---

## 📝 หมายเหตุ

- `schema.mysql.prisma` เพิ่ม `@db.VarChar(255)`, `@db.Text`, `@db.LongText` เพื่อระบุความยาวชัดเจน
- `@@index([categoryId])` และ `@@index([category])` เพิ่มเพื่อ query เร็วขึ้น
- ข้อมูลรูปยังอยู่ใน R2 (ไม่ต้องย้าย)
- ข้อมูลใน `data-export.json` เป็น backup ล่าสุด (2026-06-19) — ถ้ามีข้อมูลใหม่ต้อง export ใหม่ก่อนย้าย

---

## 🔄 ถ้าต้องการ export ข้อมูลใหม่ก่อนย้าย

```bash
# รันบน Render (PostgreSQL) ก่อนย้าย
cd backend
$env:DATABASE_URL = "<supabase-url>"
node scripts/export-sqlite.cjs  # หรือเขียน script export ใหม่
```

> **สำคัญ:** ทำ export ใหม่ก่อนย้าย เพื่อให้ข้อมูลเป็นปัจจุบัน

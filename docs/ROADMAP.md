# Roadmap & Workflow — Jump-1 (แพลตฟอร์มโชว์/ขายสินค้า)

เอกสารหลักที่ร้อยทุกอย่างเข้าด้วยกัน — เป้าหมาย, สถาปัตยกรรม, ขั้นตอนพัฒนา (workflow)
และแผนงาน 4 เฟส ใช้คู่กับ `docs/DEPLOYMENT_PLAN.md` (ฝั่งนำขึ้นเซิร์ฟเวอร์)

---

## 1. เป้าหมายโปรเจกต์

ทำเว็บโชว์/ขายสินค้าให้เป็น **skeleton ที่นำไปใช้ซ้ำได้** โดยรองรับ 2 โหมด:
- **Template เดี่ยว** — deploy แยกต่อร้าน (`TENANT_MODE=single`)
- **SaaS หลายร้าน** — ระบบเดียวรองรับหลายร้านด้วย `shop_id` + subdomain (`TENANT_MODE=multi`)

มี **แพ็คเกจ** ต่างกันต่อร้าน (เปิด/ปิดฟีเจอร์ด้วย feature flag):
- `showcase` — โชว์สินค้า + ติดต่อซื้อผ่าน LINE/FB/IG
- `ecommerce` — ตะกร้า + checkout + ชำระเงิน

---

## 2. สถาปัตยกรรมเป้าหมาย (Stack)

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind 4 + shadcn/ui + motion (ของเดิม) |
| Backend API | Node.js + TypeScript (Hono หรือ Fastify) |
| ORM | Prisma (รองรับ MySQL/MariaDB) |
| Database | MariaDB (utf8mb4) |
| Auth | JWT/session + bcrypt (สำหรับ admin) |
| Reverse proxy/HTTPS | Caddy |
| Runtime ตอนนี้ | **Native** (เตรียม Dockerfile ไว้ใช้อนาคต) |

---

## 3. Development Workflow (ทำงานบนเครื่องตัวเอง)

### 3.1 โครงสร้าง repo เป้าหมาย (หลัง refactor + เพิ่ม backend)
```
Jump-1/
├─ src/                 # frontend (React)
│  ├─ components/       # UI ใช้ซ้ำ (ProductCard, ImageGallery, ...)
│  ├─ features/         # หน้า/ฟีเจอร์ (home, product, ...)
│  ├─ config/           # categories, site config (ชื่อร้าน/ลิงก์ติดต่อ)
│  ├─ lib/              # dataSource (สลับ static JSON ↔ API ที่เดียว)
│  └─ types/            # type ส่วนกลาง (Product, Shop, ...)
├─ backend/             # Node API (เพิ่มในเฟส 2)
│  ├─ src/
│  ├─ prisma/           # schema.prisma + migrations
│  └─ package.json
├─ docs/                # เอกสาร (ROADMAP, DEPLOYMENT_PLAN)
└─ public/Product/      # ข้อมูลสินค้าเดิม (จะย้ายเข้า DB เฟส 2)
```

### 3.2 Environment (.env) — แยก dev / prod
- `.env` (ห้าม commit — ใส่ใน `.gitignore`)
- `.env.example` (commit ได้ — เป็นแม่แบบให้คนอื่น/ตัวเองตั้งตาม)

ตัวแปรหลัก:
```
# Frontend
VITE_API_URL=http://localhost:3000      # dev | prod = https://yourdomain.com

# Backend
DATABASE_URL="mysql://shop_app:<pwd>@localhost:3306/shop"
JWT_SECRET=<สุ่มยาว>
TENANT_MODE=single                      # single | multi
UPLOAD_DIR=./uploads
PORT=3000
```

### 3.3 รอบการทำงาน (วงจรปกติ)
```
1. แตก git branch:  git checkout -b feature/xxx
2. dev บนเครื่อง:    npm run dev          (frontend)
                     cd backend && npm run dev   (backend, เฟส 2+)
3. แก้ DB schema:    npx prisma migrate dev --name xxx   (เฉพาะ dev)
4. ทดสอบ + commit:  git commit
5. merge เข้า main
6. deploy:           ดู DEPLOYMENT_PLAN.md ข้อ 8
```

### 3.4 Git
- branch `main` = เวอร์ชันที่ deploy ได้เสมอ
- ทำงานบน feature branch แล้วค่อย merge
- `.env`, `node_modules/`, `dist/`, `uploads/` ต้องอยู่ใน `.gitignore`

---

## 4. แผนงาน 4 เฟส

### ✅ เฟส 0 — เสร็จแล้ว
- [x] Gallery + thumbnail arrows + lightbox
- [x] Contact buttons (placeholder)
- [x] Category filter + badge นับจำนวน + highlight
- [x] Pagination หน้าละ 10
- [x] เพิ่มหมวด "ต่างหู"

### 🔄 เฟส 1 — Refactor Frontend (ทำต่อไป)
> ไม่เปลี่ยนหน้าตา/พฤติกรรม แค่ทำให้โค้ดสะอาด + พร้อมต่อ backend
- [ ] แก้ปัญหา encoding ใน `build-products.cjs` + ลบสคริปต์ `fix-encoding*.cjs` ที่รก
- [ ] รวม `categoryMap`/categories ไว้ที่เดียว → `src/config/categories.ts`
- [ ] รวม `interface Product` → `src/types/`
- [ ] แยก site config (ชื่อร้าน, ลิงก์ติดต่อ) → `src/config/site.ts`
- [ ] สร้าง data-access layer → `src/lib/dataSource.ts`
- [ ] แยก component ใช้ซ้ำ: `ProductCard`, `ImageGallery`, `Pagination`, `ContactButtons`, `CategoryNav`
- [ ] จัดโครงโฟลเดอร์ + เพิ่มความเข้มของ TypeScript
- [ ] ตรวจว่า `npm run dev` / `build` ยังทำงานปกติ

### ⏭️ เฟส 2 — Database + Backend API
- [ ] ออกแบบ schema: `shops`, `products`, `product_images`, `categories`, `users`, `packages`
- [ ] ตั้ง Prisma + เชื่อม MariaDB
- [ ] เขียน migration ชุดแรก
- [ ] **สคริปต์ย้ายข้อมูลเดิม** (`public/Product/*` → ตาราง DB) ครั้งเดียว
- [ ] API: CRUD สินค้า, หมวดหมู่, ร้าน + auth admin
- [ ] รองรับ multi-tenant resolve (`shop_id` / subdomain) + `TENANT_MODE`

### ⏭️ เฟส 3 — Admin Panel + เชื่อม Frontend เข้า API
- [ ] หน้า admin: login, จัดการสินค้า, อัปโหลดรูป, ตั้งค่าร้าน
- [ ] สลับ `dataSource` ของ frontend จาก static JSON → API
- [ ] feature flag ตามแพ็คเกจ (showcase/ecommerce)

### ⏭️ เฟส 4 — E-commerce (ตามแพ็คเกจ)
- [ ] ตะกร้าสินค้า + checkout
- [ ] ชำระเงิน (PromptPay / บัตร)
- [ ] จัดการออเดอร์ + แจ้งเตือน (อีเมล/LINE)

---

## 5. เช็กลิสต์ "พร้อมขึ้น production" (ก่อน go-live ร้านแรก)
- [ ] เฟส 1–3 เสร็จ (อย่างน้อยโหมด showcase)
- [ ] ใส่ข้อมูลติดต่อจริง (LINE/FB/IG) แทน placeholder
- [ ] ตั้ง VPS ตาม `DEPLOYMENT_PLAN.md` (security checklist ครบ)
- [ ] domain + HTTPS ใช้งานได้
- [ ] backup อัตโนมัติ + ทดสอบกู้คืน 1 ครั้ง
- [ ] UptimeRobot เฝ้าระวัง
- [ ] ทดสอบบนมือถือ (responsive) + ความเร็วโหลด

---

## 6. เอกสารที่เกี่ยวข้อง
- `docs/DEPLOYMENT_PLAN.md` — ตั้งค่า VPS, security, backup, deploy, Docker
- `PRODUCT_GUIDE.md` — วิธีเพิ่มสินค้า (ของเดิม, ระบบไฟล์ — จะอัปเดตเมื่อมี admin)

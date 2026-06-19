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

### 3.1 โครงสร้าง repo ปัจจุบัน (หลังเฟส 1 + เฟส 2)
```
Jump-1/
├─ src/                 # frontend (React)
│  ├─ app/
│  │  ├─ components/    # UI components (Home, ProductDetail, Header, Footer)
│  │  └─ data/          # legacy data (products-generated.json)
│  ├─ config/           # environment configuration (env.ts)
│  ├─ services/         # data fetching layer (productService.ts)
│  ├─ types/            # type definitions (product.ts)
│  └─ styles/           # global styles
├─ backend/             # Node API (เฟส 2 เสร็จแล้ว)
│  ├─ src/
│  │  ├─ index.ts      # API server (Hono)
│  │  └─ seed.ts       # data migration script
│  ├─ prisma/
│  │  ├─ schema.prisma # database schema
│  │  └─ migrations/    # database migrations
│  └─ package.json
├─ docs/                # เอกสาร (ROADMAP, DEPLOYMENT_PLAN)
├─ public/Product/      # ข้อมูลสินค้าเดิม (ย้ายเข้า DB แล้ว)
├─ .env.example         # frontend env template
├─ .env.production.example # production env template
└─ .env.local           # local dev env (ไม่ commit)
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

### ✅ เฟส 1 — Refactor Frontend (เสร็จแล้ว)
> ไม่เปลี่ยนหน้าตา/พฤติกรรม แค่ทำให้โค้ดสะอาด + พร้อมต่อ backend
- [x] สร้าง `src/config/env.ts` สำหรับ environment configuration
- [x] สร้าง `src/types/product.ts` สำหรับ type definitions รวมกลาง
- [x] สร้าง `src/services/productService.ts` สำหรับ data fetching layer
- [x] Refactor `Home.tsx` ให้ใช้ services แทน hardcoded data
- [x] Refactor `ProductDetail.tsx` ให้ใช้ services แทน hardcoded data
- [x] Refactor `Header.tsx` ให้ใช้ services แทน hardcoded data
- [x] เพิ่ม `.env.example` และ `.env.production.example`
- [x] ตรวจว่า `npm run dev` / `build` ยังทำงานปกติ

### ✅ เฟส 2 — Database + Backend API (เสร็จแล้ว)
- [x] ออกแบบ schema: `Product` model ใน Prisma
- [x] ตั้ง Prisma + SQLite (สำหรับ local dev)
- [x] เขียน migration ชุดแรก
- [x] **สคริปต์ย้ายข้อมูลเดิม** (`public/Product/*` → ตาราง DB) สำเร็จ 6 products
- [x] API: GET /products, GET /products/:id, GET /products/category/:category
- [x] Backend server ทำงานบน port 3001
- [x] Frontend เชื่อมต่อกับ backend API ผ่าน VITE_API_BASE_URL

### 🔄 เฟส 3 — Admin Panel + Auth + CRUD (กำลังทำ)

#### Backend API (เสร็จแล้ว)
- [x] ออกแบบ schema: `User` model ใน Prisma (id, email, password, name, role)
- [x] ติดตั้ง bcryptjs และ jsonwebtoken
- [x] สร้าง auth middleware สำหรับ JWT verification
- [x] API: POST /auth/register (ลงทะเบียน)
- [x] API: POST /auth/login (เข้าสู่ระบบ)
- [x] API: CRUD สินค้า (POST, PUT, DELETE)
- [x] ทดสอบ Backend API (Auth + CRUD) - ผ่านทั้งหมด

#### Admin Panel UI (ลำดับขั้นตอน)
- [x] สร้างโครงสร้าง `src/app/admin/`
- [x] สร้าง Auth context/store สำหรับจัดการ token
- [x] สร้าง Login page (`/admin/login`)
- [x] สร้าง Dashboard page (`/admin`)
- [x] สร้าง Protected route wrapper (ตรวจสอบ auth)
- [x] สร้าง Products list page (`/admin/products`)
- [x] เพิ่ม category filter ใน Products list
- [x] เพิ่ม sorting (date, name, price) ใน Products list
- [x] เพิ่ม pagination (10 items/page) ใน Products list
- [x] สร้าง Add/Edit Product form (`/admin/products/new`, `/admin/products/:id/edit`)
- [x] เชื่อมต่อ Frontend กับ Backend API
- [x] สร้าง Upload image functionality (API + frontend)

#### Display Order Management (ลำดับขั้นตอนใหม่)
- [x] Phase 1: Database Schema
  - [x] เพิ่ม Category model (id, name, slug, priority, isActive)
  - [x] เพิ่ม categoryId, globalOrder, categoryOrder ใน Product model
  - [x] Migration
  - [x] Seed categories (แหวน, สร้อยคอ, สร้อยข้อมือ, ต่างหู, จี้)
  - [x] Update product seed ให้มี globalOrder และ categoryOrder
- [x] Phase 2: Backend API
  - [x] GET /categories (ดึงหมวดหมู่ตาม priority)
  - [x] POST /categories (เพิ่มหมวดหมู่)
  - [x] PUT /categories/:id/priority (อัปเดต priority)
  - [x] PUT /products/:id/globalOrder (อัปเดตลำดับทั่วไป)
  - [x] PUT /products/:id/categoryOrder (อัปเดตลำดับในหมวดหมู่)
  - [x] GET /products?mode=interleaved (ดึงสินค้าแบบ interleaved)
  - [x] GET /products?mode=grouped (ดึงสินค้าแบบ grouped)
- [x] Phase 3: Frontend - Admin Dashboard
  - [x] CategoryPriority component (ซ้าย - priority numbers)
  - [x] GlobalProductOrder component (ขวา - drag & drop)
  - [x] Toggle Button: Interleaved / Grouped
  - [x] Preview Button (ดูหน้าลูกค้าจริง)
  - [x] Save Order Button
- [x] Phase 4: Frontend - Customer View
  - [x] Home page → แสดงสินค้าแบบ interleaved (default)
  - [x] Toggle Button: Interleaved / Grouped (ให้ลูกค้าเลือกได้)

#### ระบบเสริม
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

---

## 7. ความคืบหน้ารายวัน (Daily Updates)

### 2026-06-19 — Polish UI/Content/Images (branch `polish-ui-content-images`)
ทำตาม feedback รีวิวเว็บ (UI/UX + เนื้อหา + CMS + ภาพหลายขนาด)

**UI/UX — ปรับธีมเป็น ทอง/ดำ/เทา (ไล่สีม่วงออกทั้งเว็บ):**
- ✅ Remap CSS variable ม่วง → charcoal เป็น safety net + เปลี่ยน `shadow-glow` เป็นทอง (`tailwind.css`)
- ✅ แปลง 55+ จุดแบบตั้งใจ: accent/hover/active = ทอง, ปุ่ม/fill หลัก = ดำ (Home, Header, Footer, Contact, SiteSettingsManager) + แก้ hex `#6b4c9a` ที่ hardcode
- ✅ Hero typography: ลดขนาด (6xl→5xl) + เพิ่ม `leading-[1.2]` + เว้นบรรทัด, แก้ default heroTitle/heroSubtitle ไม่ให้ซ้ำ
- ✅ Product card: เพิ่ม border บางให้มีมิติ

**เนื้อหา/ข้อมูล:**
- ✅ แก้คำผิด footer ทุกที่ (`แขวงคลองเตยเหนือ เขตวัฒนา`, `จันทร์`) — backend seed 2 บล็อก + CMS placeholder + `data-export.json`
- ✅ เพิ่ม demo contact/social เป็น default seed ใน backend (แสดงเมื่อ DB ว่าง) — footer ไม่โล่ง
- ✅ Payment icons: เปลี่ยน CreditCard ซ้ำ → VISA / Mastercard / PromptPay

**CMS:**
- ✅ ซ่อนหมวดหมู่ที่ count=0 อัตโนมัติ (Header, คง "ทั้งหมด" ไว้เสมอ)
- ✅ SEO meta per product: เพิ่ม `metaTitle`/`metaDescription` (schema + backend CRUD + ProductForm + ตั้ง `document.title`/meta ใน ProductDetail)
- ✅ ImageUpload: เพิ่ม hint สัดส่วนแนะนำ 3:4

**ภาพหลายขนาด (ลดค่าใช้จ่าย/bandwidth):**
- ✅ Backend `/upload` ใช้ `sharp` สร้าง WebP 3 ขนาด (400/800/1200px) + คืน `srcset`
- ✅ สร้าง `<ResponsiveImage>` (srcset + sizes + lazy + decoding=async + fallback) ใช้ใน Home/ProductDetail/ImageUpload
- ✅ สคริปต์ `scripts/generate-image-variants.cjs` (+ npm `build:images`) — รันแล้วได้ 246 variants สำหรับ catalog เดิม 82 รูป

**ทดสอบ:**
- ✅ Backend `npm run build` (tsc) ผ่าน
- ✅ Frontend `npm run build` (vite) ผ่าน (built in ~18s)

**ปัญหาที่พบและแก้ไข:**
- **ไฟล์เป็น CRLF**: edit แบบ multi-line ไม่ match → ใช้ node script / single-line anchor แทน
- **R2 ยังไม่ได้ implement จริง**: `/upload` ยังเก็บ local filesystem (ตามโค้ดเดิม) — ตรรกะ variant พร้อมย้ายไป R2 ได้ทันที

**⚠️ ต้องทำตอน deploy:**
- ฟิลด์ SEO เป็นคอลัมน์ใหม่ใน Prisma → ต้องรัน `npx prisma db push` (หรือ `prisma migrate deploy`) บน DB จริงก่อน ไม่งั้น API products จะ error
- commit ไฟล์ `*.webp` variants (246 ไฟล์) เพื่อให้ srcset ใช้ได้บน production (Vercel static build ไม่มี sharp)

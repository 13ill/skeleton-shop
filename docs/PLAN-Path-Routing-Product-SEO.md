# Plan: Path Routing + Product-level SEO (Phase 2)

> สถานะ: **แผนรอทำ** (ยังไม่ได้เริ่ม)
> ความสำคัญ: Medium — ทำหลัง deploy Phase 1 แล้ว
> ผู้รับผิดชอบ: Developer

---

## 🎯 เป้าหมาย

ให้ Google เห็นสินค้าแต่ละชิ้นเป็นหน้าแยก มี title/description ของตัวเอง ติดอันดับในผลค้นหาได้

---

## 📊 สถานะปัจจุบัน (Phase 1 — ทำแล้ว)

- ✅ Store-level SEO (title, description, keywords, og:image)
- ✅ ItemList structured data — ฝังสินค้าทั้งหมดในหน้าแรก
- ✅ robots.txt + sitemap.xml dynamic
- ✅ ใช้ `createBrowserRouter` อยู่แล้ว (URL = `/product/:id` ไม่ใช่ `/#/product/:id`)

---

## 🔧 สิ่งที่ต้องทำ (Phase 2)

### 1. อัปเดต `api/seo.js` — อ่าน path แล้วปรับ meta ตามสินค้า

**ปัจจุบัน:** seo.js ส่ง HTML เดียวกันทุกหน้า
**ต้องแก้:** อ่าน `req.url` ถ้าเป็น `/product/:id` ให้ดึง SEO เฉพาะของสินค้านั้น

```js
// ตัวอย่างโลจิก
const path = new URL(req.url).pathname
if (path.startsWith('/product/')) {
  const productId = path.split('/product/')[1]
  // ดึง product SEO จาก /public/seo/product/:id
  // แทน title/description ด้วย metaTitle/metaDescription ของสินค้า
}
```

### 2. เพิ่ม backend endpoint `/public/seo/product/:id`

ดึง SEO เฉพาะสินค้า:
- `metaTitle` → title
- `metaDescription` → description
- `images[0]` → og:image
- สร้าง Product structured data (schema.org/Product)

### 3. อัปเดต sitemap — ใช้ path จริง

- ✅ ทำแล้ว: `/product/:id` (ไม่ใช้ `/#/`)
- ✅ ทำแล้ว: `/?category=:slug` (ใช้ query param ตาม routing จริง)

### 4. ทดสอบด้วย Google Rich Results Test

- ส่ง URL สินค้าไปที่ https://search.google.com/test/rich-results
- ตรวจสอบว่า Google เห็น Product structured data

---

## ⚠️ ความเสี่ยง

1. **Vercel rewrite อาจส่ง static assets ไป seo.js ด้วย** — ต้องตรวจสอบ regex ใน vercel.json
2. **Cold start + 2 API calls** — seo.js เรียก backend 2 ครั้ง (store SEO + product SEO) อาจช้า
3. **ถ้าสินค้าไม่มี metaTitle** — ต้อง fallback ไปใช้ product.name

---

## 📅 ลำดับการทำ

1. เพิ่ม `/public/seo/product/:id` ใน backend
2. อัปเดต `api/seo.js` ให้อ่าน path และปรับ meta
3. ทดสอบด้วย curl — ดู HTML ของหน้าสินค้า
4. ทดสอบด้วย Google Rich Results Test
5. Deploy และ submit sitemap ใหม่ใน Google Search Console

---

## 🎓 บทเรียนที่คาดว่าจะได้

1. SPA + SEO ทำได้หลายระดับ — store → product → หน้าแยก
2. Path routing สำคัญกว่า hash routing สำหรับ SEO
3. Google อ่าน structured data ได้แม้ไม่ render JavaScript

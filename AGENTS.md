# Jump-1 — Project Info

## Hosting (สำคัญ — ตรวจสอบก่อนทุกครั้ง)

| Component | Platform | URL | Notes |
|---|---|---|---|
| **Frontend** | **Cloudflare Pages** | https://niwelry.com | ใช้ `wrangler deploy`, ไม่ใช่ Vercel |
| **Backend** | **Render** | https://jump-1-backend.onrender.com | free tier (cold start ~30s) |
| **Database** | **Supabase** | (PostgreSQL pooler) | |
| **Image Storage** | **Cloudflare R2** | `pub-2d7e25b6f92840b9b82cc077b739efd8.r2.dev` | |

### วิธีตรวจสอบ hosting
```bash
curl -s -I https://niwelry.com/ | grep -i server
# Server: cloudflare → Cloudflare Pages
# Server: Vercel → Vercel
```

## Git

| | |
|---|---|
| **Repo** | `13ill/skeleton-shop` |
| **Frontend root** | `/` (root directory) |
| **Backend root** | `backend/` |
| **Production branch** | `ui-enhancements-review` |

## Cloudflare Pages Settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Production branch | `ui-enhancements-review` |

### Environment Variables (Cloudflare Pages)
- `VITE_API_BASE_URL` = `https://jump-1-backend.onrender.com`

## SEO Architecture (Portable)

```
src/seo/core.js          — platform-agnostic core logic (fetch SEO, inject meta tags)
functions/               — Cloudflare Pages Functions (production)
  [[catchall]].js        — catch-all: inject SEO into index.html
  robots.txt.js          — serve robots.txt
  sitemap.xml.js         — serve sitemap.xml
  _routes.json           — exclude static assets from functions
api/                     — Vercel Serverless Functions (สำรอง ถ้าย้าย)
  seo.js                 — uses core.js
  robots.js              — uses core.js
  sitemap.js             — uses core.js
vercel.json              — Vercel config (สำรอง ถ้าย้าย)
```

### ถ้าย้าย hosting
- **ไป Vercel:** ใช้ `api/` + `vercel.json` (มีอยู่แล้ว)
- **ไป VPS:** สร้าง Express server ที่ import `src/seo/core.js`
- **อยู่ Cloudflare:** ใช้ `functions/` (ปัจจุบัน)

## Build Commands

```bash
# Frontend
npm run build              # vite build (frontend)
npm run dev                # vite dev server

# Backend
cd backend
npm run dev                # tsx watch
npm run build              # skip (tsx transpiles at runtime)
npm start                  # tsx src/index.ts
```

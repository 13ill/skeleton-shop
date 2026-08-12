/**
 * Cloudflare Pages Function — catch-all สำหรับทุก path
 *
 * ทำงาน: อ่าน index.html จาก static assets → ดึง SEO จาก backend → แทรก meta tags → ส่งกลับ
 * ทำให้ Google bot เห็น meta tags จริงใน HTML ตั้งต้น ไม่ต้องรอ JavaScript render
 *
 * วิธีการ: Cloudflare Pages Functions ใช้ onRequest(context) API
 * context.request = Request object (Web API)
 * context.env = environment variables
 * context.params = path parameters
 */
import { fetchSeo, injectSeoIntoHtml } from '../src/seo/core.js'

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`
  const pathname = url.pathname

  // อ่าน index.html จาก static assets (Cloudflare Pages เก็บไว้ใน ASSETS)
  // วิธีที่ 1: ใช้ context.assets (ใหม่)
  // วิธีที่ 2: fetch จาก origin เอง (เก่า — ทำงานได้แต่ช้ากว่า)
  let html = null
  try {
    if (context.assets) {
      html = await context.assets.fetch(new Request(`${origin}/index.html`)).then(r => r.text())
    }
  } catch {
    // ลองวิธีอื่น
  }

  if (!html) {
    try {
      const res = await fetch(`${origin}/index.html`)
      if (res.ok) html = await res.text()
    } catch {
      // fallback
    }
  }

  if (!html) {
    return new Response('index.html not found', { status: 500 })
  }

  // Google Search Console site verification (optional env var)
  // ค่า content ของ <meta name="google-site-verification" content="...">
  // ตั้งใน Cloudflare Pages → Settings → Environment Variables
  if (env.GOOGLE_SITE_VERIFICATION) {
    const tag = `<meta name="google-site-verification" content="${env.GOOGLE_SITE_VERIFICATION}">`
    if (!html.includes('google-site-verification')) {
      html = html.replace('</head>', `    ${tag}\n  </head>`)
    }
  }

  // ดึง SEO จาก backend
  const apiUrl = env.VITE_API_BASE_URL || ''
  const { seo, isProductPage } = await fetchSeo({
    apiUrl,
    host,
    pathname,
    origin,
  })

  if (!seo) {
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // แทรก meta tags
  const productPath = isProductPage ? pathname : null
  const finalHtml = injectSeoIntoHtml(html, seo, origin, productPath)

  return new Response(finalHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  })
}

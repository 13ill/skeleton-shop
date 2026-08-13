/**
 * Cloudflare Workers — entry point สำหรับ SEO injection
 *
 * ทำงานร่วมกับ [assets] ใน wrangler.toml:
 * - Static assets (JS, CSS, images) → served โดยตรงโดย Cloudflare
 * - HTML requests (/, /product/*) → Worker อ่าน index.html จาก assets → inject SEO → return
 * - /robots.txt → ดึงจาก backend
 * - /sitemap.xml → ดึงจาก backend
 *
 * ใช้ core logic จาก src/seo/core.js (platform-agnostic)
 */
import { fetchSeo, injectSeoIntoHtml, fetchRobots, fetchSitemap } from './seo/core.js'

// Paths ที่เป็น static assets — ไม่ต้องผ่าน Worker
const STATIC_PREFIXES = ['/assets/', '/Product/', '/uploads/']
const STATIC_FILES = ['/favicon.ico', '/sw.js', '/manifest.json', '/vite.svg', '/placeholder.jpg', '/placeholder.svg']

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const origin = `${protocol}://${host}`
    const pathname = url.pathname
    const apiUrl = env.VITE_API_BASE_URL || ''

    // 1. Static assets — serve โดยตรงจาก ASSETS binding (ไม่ผ่าน SEO injection)
    if (STATIC_PREFIXES.some(p => pathname.startsWith(p)) || STATIC_FILES.includes(pathname)) {
      return env.ASSETS.fetch(request)
    }

    // 2. robots.txt — ดึงจาก backend
    if (pathname === '/robots.txt') {
      const robots = await fetchRobots(apiUrl, host, origin)
      if (robots) {
        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        })
      }
      const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
      return new Response(defaultRobots, {
        headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=3600' },
      })
    }

    // 3. sitemap.xml — ดึงจาก backend
    if (pathname === '/sitemap.xml') {
      const sitemap = await fetchSitemap(apiUrl, host, origin)
      if (sitemap) {
        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        })
      }
      const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
      return new Response(defaultXml, {
        headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
      })
    }

    // 4. ทุก path อื่น (HTML requests) — อ่าน index.html → inject SEO → return
    // อ่าน index.html จาก static assets
    let html = null
    try {
      const assetResponse = await env.ASSETS.fetch(new Request(`${origin}/index.html`))
      if (assetResponse.ok) {
        html = await assetResponse.text()
      }
    } catch {
      // fallback: fetch จาก origin
    }

    if (!html) {
      try {
        const res = await fetch(`${origin}/index.html`)
        if (res.ok) html = await res.text()
      } catch {
        return new Response('index.html not found', { status: 500 })
      }
    }

    if (!html) {
      return new Response('index.html not found', { status: 500 })
    }

    // Google Search Console site verification (optional env var)
    const gsv = env.GOOGLE_SITE_VERIFICATION
    if (gsv && !html.includes('google-site-verification')) {
      const tag = `<meta name="google-site-verification" content="${gsv}">`
      html = html.replace('</head>', `    ${tag}\n  </head>`)
    }

    // ดึง SEO จาก backend
    const { seo, isProductPage } = await fetchSeo({ apiUrl, host, pathname, origin })

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
  },
}

/**
 * Cloudflare Pages Function — ส่ง sitemap.xml แบบ dynamic ตาม domain
 * ดึงจาก Hono backend: /public/sitemap?domain=...
 */
import { fetchSitemap } from '../src/seo/core.js'

export async function onRequest(context) {
  const { request, env } = context
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`
  const apiUrl = env.VITE_API_BASE_URL || ''

  const sitemap = await fetchSitemap(apiUrl, host, origin)

  if (sitemap) {
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  // Default sitemap ถ้า backend ไม่ตอบ — มีแค่หน้าหลัก
  const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
  return new Response(defaultXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

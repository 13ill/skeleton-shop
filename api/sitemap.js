/**
 * Vercel Serverless Function — ส่ง sitemap.xml แบบ dynamic ตาม domain
 * ดึงจาก Hono backend: /public/sitemap?domain=...
 * Sitemap มีสินค้าและหมวดหมู่ของร้านนั้น
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`

  const apiUrl = process.env.VITE_API_BASE_URL || ''

  if (apiUrl) {
    try {
      const apiRes = await fetch(`${apiUrl}/public/sitemap?domain=${encodeURIComponent(host)}`, {
        headers: { Origin: origin },
        signal: AbortSignal.timeout(5000),
      })

      if (apiRes.ok) {
        const xml = await apiRes.text()
        res.setHeader('Content-Type', 'application/xml')
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
        res.status(200).send(xml)
        return
      }
    } catch {
      // fallback
    }
  }

  // Default sitemap ถ้า backend ไม่ตอบ — มีแค่หน้าหลัก
  const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).send(defaultXml)
}

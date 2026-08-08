import { fetchSitemap } from '../src/seo/core.js'

/**
 * Vercel Serverless Function — ส่ง sitemap.xml แบบ dynamic
 * ใช้ core logic จาก src/seo/core.js
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`
  const apiUrl = process.env.VITE_API_BASE_URL || ''

  const sitemap = await fetchSitemap(apiUrl, host, origin)

  if (sitemap) {
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.status(200).send(sitemap)
    return
  }

  const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).send(defaultXml)
}

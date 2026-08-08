/**
 * Vercel Serverless Function — ส่ง robots.txt แบบ dynamic ตาม domain
 * ดึงจาก Hono backend: /public/robots?domain=...
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`

  const apiUrl = process.env.VITE_API_BASE_URL || ''

  if (apiUrl) {
    try {
      const apiRes = await fetch(`${apiUrl}/public/robots?domain=${encodeURIComponent(host)}`, {
        headers: { Origin: origin },
        signal: AbortSignal.timeout(3000),
      })

      if (apiRes.ok) {
        const text = await apiRes.text()
        res.setHeader('Content-Type', 'text/plain')
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
        res.status(200).send(text)
        return
      }
    } catch {
      // fallback
    }
  }

  // Default robots.txt ถ้า backend ไม่ตอบ
  const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).send(defaultRobots)
}

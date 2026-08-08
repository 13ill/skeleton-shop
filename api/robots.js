import { fetchRobots } from '../src/seo/core.js'

/**
 * Vercel Serverless Function — ส่ง robots.txt แบบ dynamic
 * ใช้ core logic จาก src/seo/core.js
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`
  const apiUrl = process.env.VITE_API_BASE_URL || ''

  const robots = await fetchRobots(apiUrl, host, origin)

  if (robots) {
    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.status(200).send(robots)
    return
  }

  const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).send(defaultRobots)
}

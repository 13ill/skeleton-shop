/**
 * Cloudflare Pages Function — ส่ง robots.txt แบบ dynamic ตาม domain
 * ดึงจาก Hono backend: /public/robots?domain=...
 */
import { fetchRobots } from '../src/seo/core.js'

export async function onRequest(context) {
  const { request, env } = context
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`
  const apiUrl = env.VITE_API_BASE_URL || ''

  const robots = await fetchRobots(apiUrl, host, origin)

  if (robots) {
    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  // Default robots.txt ถ้า backend ไม่ตอบ
  const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  return new Response(defaultRobots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

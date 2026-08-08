import fs from 'fs'
import path from 'path'
import { fetchSeo, injectSeoIntoHtml } from '../src/seo/core.js'

/**
 * Vercel Serverless Function — แทรก SEO meta tags จาก Hono backend ลงใน index.html
 *
 * ใช้ core logic จาก src/seo/core.js (platform-agnostic)
 * ไฟล์นี้เป็นแค่ adapter สำหรับ Vercel API (req/res)
 *
 * ถ้าย้ายไป Cloudflare Pages → ใช้ functions/[[catchall]].js แทน
 * ถ้าย้ายไป VPS → ใช้ server/index.js (Express adapter)
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`
  const url = new URL(req.url, origin)
  const pathname = url.pathname

  // อ่าน index.html — ลองหลายตำแหน่งเพราะ outputDirectory อาจเปลี่ยน root
  let html
  const possiblePaths = [
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(__dirname, '..', 'dist', 'index.html'),
    path.join(__dirname, '..', 'index.html'),
  ]
  for (const p of possiblePaths) {
    try { html = fs.readFileSync(p, 'utf-8'); break } catch { /* ลองตำแหน่งถัดไป */ }
  }
  if (!html) { res.status(500).send('index.html not found'); return }

  // ดึง SEO จาก backend
  const apiUrl = process.env.VITE_API_BASE_URL || ''
  const { seo, isProductPage } = await fetchSeo({ apiUrl, host, pathname, origin })

  if (!seo) {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
    return
  }

  // แทรก meta tags
  const productPath = isProductPage ? pathname : null
  const finalHtml = injectSeoIntoHtml(html, seo, origin, productPath)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600')
  res.status(200).send(finalHtml)
}

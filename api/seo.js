import fs from 'fs'
import path from 'path'

/**
 * Vercel Serverless Function — แทรก SEO meta tags จาก Hono backend ลงใน index.html
 *
 * ทำงาน: อ่าน index.html ที่ build แล้ว → ดึง SEO จาก backend ตาม domain → แทรก meta tags → ส่งกลับ
 * วิธีนี้ทำให้ Google bot เห็น meta tags จริงใน HTML ตั้งต้น ไม่ต้องรอ JavaScript render
 */
export default async function handler(req, res) {
  const host = req.headers.host || ''
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${protocol}://${host}`

  // อ่าน index.html ที่ build แล้ว (Vite output = dist/)
  const htmlPath = path.join(process.cwd(), 'dist', 'index.html')
  let html
  try {
    html = fs.readFileSync(htmlPath, 'utf-8')
  } catch {
    try {
      html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8')
    } catch {
      res.status(500).send('index.html not found')
      return
    }
  }

  // ดึง SEO จาก Hono backend
  const apiUrl = process.env.VITE_API_BASE_URL || ''
  let seo = null
  if (apiUrl) {
    try {
      const seoRes = await fetch(`${apiUrl}/public/seo?domain=${encodeURIComponent(host)}`, {
        headers: { Origin: origin },
        signal: AbortSignal.timeout(3000),
      })
      if (seoRes.ok) {
        seo = await seoRes.json()
      }
    } catch {
      // ถ้า backend ไม่ตอบ ใช้ default meta tags ใน index.html
    }
  }

  if (!seo) {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
    return
  }

  // แทรก meta tags ลงใน <head>
  const metaTags = buildMetaTags(seo, origin)
  const structuredData = buildStructuredDataScript(seo)

  // แทนที่ title
  if (seo.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
  }

  // แทนที่ meta description
  if (seo.description) {
    if (html.includes('name="description"')) {
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeAttr(seo.description)}" />`
      )
    } else {
      metaTags.push(`<meta name="description" content="${escapeAttr(seo.description)}" />`)
    }
  }

  // แทนที่ meta robots
  if (seo.robots) {
    if (html.includes('name="robots"')) {
      html = html.replace(
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
        `<meta name="robots" content="${escapeAttr(seo.robots)}" />`
      )
    } else {
      metaTags.push(`<meta name="robots" content="${escapeAttr(seo.robots)}" />`)
    }
  }

  // แทนที่ canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(origin + '/')}" />`
  )

  // แทรก meta tags ทั้งหมด + structured data ก่อน </head>
  const injection = metaTags.join('\n    ') + '\n    ' + structuredData
  html = html.replace('</head>', `    ${injection}\n  </head>`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600')
  res.status(200).send(html)
}

function buildMetaTags(seo, origin) {
  const tags = []

  // Open Graph
  tags.push(`<meta property="og:title" content="${escapeAttr(seo.title || '')}" />`)
  tags.push(`<meta property="og:description" content="${escapeAttr(seo.description || '')}" />`)
  tags.push(`<meta property="og:type" content="website" />`)
  tags.push(`<meta property="og:url" content="${escapeAttr(origin + '/')}" />`)
  if (seo.ogImageUrl) {
    tags.push(`<meta property="og:image" content="${escapeAttr(seo.ogImageUrl)}" />`)
  }

  // Twitter Card
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  tags.push(`<meta name="twitter:title" content="${escapeAttr(seo.title || '')}" />`)
  tags.push(`<meta name="twitter:description" content="${escapeAttr(seo.description || '')}" />`)
  if (seo.ogImageUrl) {
    tags.push(`<meta name="twitter:image" content="${escapeAttr(seo.ogImageUrl)}" />`)
  }

  // Keywords
  if (seo.keywords) {
    tags.push(`<meta name="keywords" content="${escapeAttr(seo.keywords)}" />`)
  }

  return tags
}

function buildStructuredDataScript(seo) {
  if (!seo.structuredData) return ''
  const json = JSON.stringify(seo.structuredData)
  return `<script type="application/ld+json">${json}</script>`
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

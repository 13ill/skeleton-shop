/**
 * Core SEO logic — platform-agnostic
 *
 * ใช้โดย:
 * - functions/[[catchall]].js (Cloudflare Pages Functions)
 * - api/seo.js (Vercel Serverless Functions)
 * - server/index.js (Node.js/Express ถ้าเช่า VPS)
 *
 * ไม่ depend กับ platform API (ไม่ใช้ req/res ของ Express หรือ context ของ Cloudflare)
 * รับแค่ plain object แล้วส่งคืน plain object
 */

/**
 * ดึง SEO จาก backend ตาม domain และ path
 * @param {Object} params
 * @param {string} params.apiUrl - backend URL (เช่น https://jump-1-backend.onrender.com)
 * @param {string} params.host - request host (เช่น niwelry.com)
 * @param {string} params.pathname - request path (เช่น / หรือ /product/xxx)
 * @param {string} [params.origin] - origin URL (เช่น https://niwelry.com)
 * @returns {Promise<{seo: Object|null, isProductPage: boolean}>}
 */
export async function fetchSeo({ apiUrl, host, pathname, origin }) {
  if (!apiUrl) return { seo: null, isProductPage: false }

  const productMatch = pathname.match(/^\/product\/(.+)$/)
  const originUrl = origin || `https://${host}`

  try {
    // หน้าสินค้า — ดึง SEO เฉพาะของสินค้านั้น
    if (productMatch) {
      const productId = productMatch[1]
      const productRes = await fetch(
        `${apiUrl}/public/seo/product/${encodeURIComponent(productId)}?domain=${encodeURIComponent(host)}`,
        { headers: { Origin: originUrl }, signal: AbortSignal.timeout(3000) }
      )
      if (productRes.ok) {
        const seo = await productRes.json()
        return { seo, isProductPage: true }
      }
    }

    // ถ้าไม่ใช่หน้าสินค้า หรือดึงสินค้าไม่สำเร็จ → ดึง store-level SEO
    const seoRes = await fetch(
      `${apiUrl}/public/seo?domain=${encodeURIComponent(host)}`,
      { headers: { Origin: originUrl }, signal: AbortSignal.timeout(3000) }
    )
    if (seoRes.ok) {
      const seo = await seoRes.json()
      return { seo, isProductPage: false }
    }
  } catch {
    // ถ้า backend ไม่ตอบ ใช้ default meta tags ใน index.html
  }

  return { seo: null, isProductPage: false }
}

/**
 * แทรก SEO meta tags ลงใน HTML
 * @param {string} html - index.html ตั้งต้น
 * @param {Object} seo - SEO data จาก backend
 * @param {string} origin - origin URL
 * @param {string|null} productPath - path ของหน้าสินค้า (ถ้าเป็นหน้าสินค้า)
 * @returns {string} HTML ที่แทรก meta tags แล้ว
 */
export function injectSeoIntoHtml(html, seo, origin, productPath = null) {
  if (!seo) return html

  const metaTags = buildMetaTags(seo, origin, productPath)
  const structuredData = buildStructuredDataScript(seo, !!productPath)

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

  // แทนที่ canonical — ใช้ path จริงสำหรับหน้าสินค้า
  const canonicalUrl = productPath ? `${origin}${productPath}` : `${origin}/`
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
  )

  // ลบ OG tags เก่าทั้งหมดจาก index.html เพื่อไม่ให้ซ้ำกับที่จะแทรกใหม่
  html = html.replace(/<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>/g, '')
  html = html.replace(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>/g, '')

  // แทรก meta tags ทั้งหมด + structured data ก่อน </head>
  const injection = metaTags.join('\n    ') + '\n    ' + structuredData
  html = html.replace('</head>', `    ${injection}\n  </head>`)

  return html
}

/**
 * ดึง robots.txt จาก backend
 * @param {string} apiUrl - backend URL
 * @param {string} host - request host
 * @param {string} origin - origin URL
 * @returns {Promise<string|null>} robots.txt content หรือ null ถ้า backend ไม่ตอบ
 */
export async function fetchRobots(apiUrl, host, origin) {
  if (!apiUrl) return null
  try {
    const res = await fetch(
      `${apiUrl}/public/robots?domain=${encodeURIComponent(host)}`,
      { headers: { Origin: origin }, signal: AbortSignal.timeout(3000) }
    )
    if (res.ok) return await res.text()
  } catch {
    // fallback
  }
  return null
}

/**
 * ดึง sitemap.xml จาก backend
 * @param {string} apiUrl - backend URL
 * @param {string} host - request host
 * @param {string} origin - origin URL
 * @returns {Promise<string|null>} sitemap.xml content หรือ null ถ้า backend ไม่ตอบ
 */
export async function fetchSitemap(apiUrl, host, origin) {
  if (!apiUrl) return null
  try {
    const res = await fetch(
      `${apiUrl}/public/sitemap?domain=${encodeURIComponent(host)}`,
      { headers: { Origin: origin }, signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) return await res.text()
  } catch {
    // fallback
  }
  return null
}

// ─── Private helpers ───

function buildMetaTags(seo, origin, productPath = null) {
  const tags = []
  const ogUrl = productPath ? `${origin}${productPath}` : `${origin}/`
  const ogType = productPath ? 'product' : 'website'

  tags.push(`<meta property="og:title" content="${escapeAttr(seo.title || '')}" />`)
  tags.push(`<meta property="og:description" content="${escapeAttr(seo.description || '')}" />`)
  tags.push(`<meta property="og:type" content="${ogType}" />`)
  tags.push(`<meta property="og:url" content="${escapeAttr(ogUrl)}" />`)
  if (seo.ogImageUrl) {
    tags.push(`<meta property="og:image" content="${escapeAttr(seo.ogImageUrl)}" />`)
  }

  tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  tags.push(`<meta name="twitter:title" content="${escapeAttr(seo.title || '')}" />`)
  tags.push(`<meta name="twitter:description" content="${escapeAttr(seo.description || '')}" />`)
  if (seo.ogImageUrl) {
    tags.push(`<meta name="twitter:image" content="${escapeAttr(seo.ogImageUrl)}" />`)
  }

  if (seo.keywords) {
    tags.push(`<meta name="keywords" content="${escapeAttr(seo.keywords)}" />`)
  }

  return tags
}

function buildStructuredDataScript(seo, isProductPage = false) {
  const scripts = []
  if (seo.structuredData) {
    scripts.push(`<script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>`)
  }
  if (!isProductPage && seo.itemList && seo.itemList.itemListElement?.length > 0) {
    scripts.push(`<script type="application/ld+json">${JSON.stringify(seo.itemList)}</script>`)
  }
  return scripts.join('\n    ')
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

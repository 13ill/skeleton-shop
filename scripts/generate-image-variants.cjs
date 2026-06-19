#!/usr/bin/env node
/**
 * Pre-generate responsive WebP variants for every image under public/Product.
 *
 * For "foo.jpg" it creates: foo-400.webp, foo-800.webp, foo-1200.webp
 * (skipping widths larger than the source and files that already exist).
 *
 * The storefront's <ResponsiveImage> builds a srcSet from these names, so the
 * browser downloads an appropriately-sized image instead of the full original
 * — cutting bandwidth / CDN egress cost.
 *
 * Usage:  node scripts/generate-image-variants.cjs
 * Requires `sharp` (installed in ./backend). Run after adding new product images.
 */
const fs = require('fs');
const path = require('path');

// Reuse sharp from the backend install to avoid a duplicate dependency.
let sharp;
try {
  sharp = require(path.join(__dirname, '..', 'backend', 'node_modules', 'sharp'));
} catch (e) {
  try { sharp = require('sharp'); } catch (e2) {
    console.error('sharp not found. Run `npm install sharp` in ./backend first.');
    process.exit(1);
  }
}

const WIDTHS = [400, 800, 1200];
const ROOT = path.join(__dirname, '..', 'public', 'Product');
const SRC_RE = /\.(jpe?g|png)$/i;
const VARIANT_RE = /-\d+\.webp$/i;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (SRC_RE.test(entry.name) && !VARIANT_RE.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('Not found:', ROOT);
    process.exit(1);
  }
  const files = walk(ROOT);
  console.log(`Found ${files.length} source images`);
  let made = 0, skipped = 0;

  for (const file of files) {
    const ext = path.extname(file);
    const base = file.slice(0, -ext.length);
    let meta;
    try { meta = await sharp(file).metadata(); } catch { meta = {}; }

    for (let i = 0; i < WIDTHS.length; i++) {
      const width = WIDTHS[i];
      if (meta.width && meta.width < width && i > 0) continue; // don't upscale
      const out = `${base}-${width}.webp`;
      if (fs.existsSync(out)) { skipped++; continue; }
      try {
        await sharp(file)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(out);
        made++;
      } catch (err) {
        console.error('Failed:', out, err.message);
      }
    }
  }
  console.log(`Done. Created ${made} variants, skipped ${skipped} existing.`);
}

main();

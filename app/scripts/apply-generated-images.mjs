// Download generated studio images (PNG) and write web-sized JPEGs into
// public/images/dishes/<slug>.jpg, overwriting the previous photos.
// Reads scripts/gen-image-urls.json: { "<slug>": "<rawUrl>", ... }
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const map = JSON.parse(fs.readFileSync(path.resolve('scripts/gen-image-urls.json'), 'utf8'));
const OUT = path.resolve('public/images/dishes');
fs.mkdirSync(OUT, { recursive: true });

const ok = [];
const failed = [];

for (const [slug, url] of Object.entries(map)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const img = await Jimp.read(buf);
    // square menu/thumbnail asset: cap at 900px, good-quality JPEG
    if (img.bitmap.width > 900) img.resize(900, Jimp.AUTO);
    img.quality(82);
    const outPath = path.join(OUT, `${slug}.jpg`);
    await img.writeAsync(outPath);
    const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
    ok.push(`${slug} (${kb}KB)`);
    console.log(`✓ ${slug} → ${kb}KB`);
  } catch (e) {
    failed.push(`${slug}: ${e.message}`);
    console.log(`✗ ${slug}: ${e.message}`);
  }
}

console.log(`\nDone. ${ok.length} written, ${failed.length} failed.`);
if (failed.length) console.log('Failed:\n' + failed.join('\n'));

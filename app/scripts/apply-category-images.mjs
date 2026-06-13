// Download generated category images (PNG) and write web-sized JPEGs into
// public/images/<filename>. Reads scripts/gen-category-urls.json: { "<file>": "<rawUrl>" }
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const map = JSON.parse(fs.readFileSync(path.resolve('scripts/gen-category-urls.json'), 'utf8'));
const OUT = path.resolve('public/images');

const failed = [];
for (const [file, url] of Object.entries(map)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const img = await Jimp.read(buf);
    if (img.bitmap.width > 800) img.resize(800, Jimp.AUTO);
    img.quality(82);
    const outPath = path.join(OUT, file);
    await img.writeAsync(outPath);
    console.log(`✓ ${file} → ${(fs.statSync(outPath).size / 1024).toFixed(0)}KB`);
  } catch (e) {
    failed.push(`${file}: ${e.message}`);
    console.log(`✗ ${file}: ${e.message}`);
  }
}
console.log(`\nDone. ${Object.keys(map).length - failed.length} written, ${failed.length} failed.`);
if (failed.length) console.log(failed.join('\n'));

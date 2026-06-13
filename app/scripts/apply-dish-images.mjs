// Apply the fetched dish images to menuItems.image.
// Usage: DATABASE_URL=... node scripts/apply-dish-images.mjs
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const map = JSON.parse(fs.readFileSync(path.resolve('scripts/dish-image-map.json'), 'utf8'));
const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is required'); process.exit(1); }

const conn = await mysql.createConnection(url);
let n = 0;
for (const [id, image] of Object.entries(map)) {
  const [r] = await conn.execute('UPDATE menuItems SET image = ? WHERE id = ?', [image, Number(id)]);
  if (r.affectedRows) n++;
}
const [[{ withImg }]] = await conn.query(
  "SELECT COUNT(*) AS withImg FROM menuItems WHERE image IS NOT NULL AND image <> ''");
console.log(`Updated ${n} rows. menuItems with image now: ${withImg}`);
await conn.end();

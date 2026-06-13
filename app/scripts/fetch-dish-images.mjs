// One-off: source dish-accurate photos from Wikimedia Commons (keyless, CC),
// download them to public/images/dishes/, and emit an id->image map + credits.
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/images/dishes');
fs.mkdirSync(OUT_DIR, { recursive: true });

// id matches menuItems.id (= sortOrder in seed). [id, slug, primaryQuery, fallbackQuery, keyword]
const DISHES = [
  [1, 'samosa', 'Samosa', 'Samosa chaat', 'samosa'],
  [2, 'pani-puri', 'Pani puri', 'Golgappa', 'puri'],
  [3, 'pav-bhaji', 'Pav bhaji', 'Pav bhaji mumbai', 'bhaji'],
  [4, 'chole-bhature', 'Chole bhature', 'Chana bhatura', 'bhatur'],
  [5, 'vada-pav', 'Vada pav', 'Vada pao', 'vada'],
  [6, 'aloo-tikki-chaat', 'Aloo tikki', 'Tikki chaat', 'tikki'],
  [7, 'masala-dosa', 'Masala dosa', 'Dosa restaurant', 'dosa'],
  [8, 'paneer-masala-dosa', 'Paneer dosa', 'Masala dosa', 'dosa'],
  [9, 'mysore-masala-dosa', 'Mysore masala dosa', 'Masala dosa', 'dosa'],
  [10, 'idli', 'Idli sambar', 'Idli', 'idli'],
  [11, 'medu-vada', 'Medu vada', 'Vada sambar', 'vada'],
  [12, 'butter-chicken', 'Butter chicken', 'Murgh makhani', 'chicken'],
  [13, 'kadai-paneer', 'Kadai paneer', 'Paneer curry', 'paneer'],
  [14, 'palak-paneer', 'Palak paneer', 'Saag paneer', 'paneer'],
  [15, 'chicken-tikka-masala', 'Chicken tikka masala', 'Chicken tikka', 'chicken'],
  [16, 'dal-makhani', 'Dal makhani', 'Dal makhni', 'dal'],
  [17, 'garlic-naan', 'Garlic naan', 'Naan bread', 'naan'],
  [18, 'butter-naan', 'Naan', 'Tandoori naan', 'naan'],
  [19, 'veg-manchurian', 'Vegetable Manchurian', 'Gobi manchurian', 'manchurian'],
  [20, 'hakka-noodles', 'Hakka noodles', 'Chow mein noodles', 'noodle'],
  [21, 'chilli-chicken', 'Chilli chicken', 'Chili chicken indian', 'chicken'],
  [22, 'fried-rice', 'Vegetable fried rice', 'Fried rice', 'rice'],
  [23, 'chicken-biryani', 'Chicken biryani', 'Hyderabadi biryani', 'biryani'],
  [24, 'subz-biryani', 'Vegetable biryani', 'Veg biryani', 'biryani'],
  [25, 'gulab-jamun', 'Gulab jamun', 'Gulab jamun dessert', 'jamun'],
  [26, 'gajar-ka-halwa', 'Gajar ka halwa', 'Carrot halwa', 'halwa'],
  [27, 'mango-lassi', 'Mango lassi', 'Lassi drink', 'lassi'],
  [28, 'masala-chai', 'Masala chai', 'Indian tea chai', 'chai'],
  [29, 'jaljeera', 'Jaljeera', 'Jal jeera drink', 'jeera'],
];

const UA = 'AuraCurryHouseCafe/1.0 (menu image sourcing; contact admin)';
const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchRetry(url, opts = {}, tries = 6) {
  let wait = 1200;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { ...opts, headers: { 'User-Agent': UA, ...(opts.headers || {}) } });
    if (res.ok) return res;
    if (res.status === 429 || res.status >= 500) {
      const ra = parseInt(res.headers.get('retry-after') || '0', 10);
      const delay = ra > 0 ? ra * 1000 : wait;
      console.log(`  …${res.status}, waiting ${(delay / 1000).toFixed(1)}s (try ${i + 1}/${tries})`);
      await sleep(delay);
      wait = Math.min(wait * 2, 20000);
      continue;
    }
    throw new Error(`HTTP ${res.status}`);
  }
  throw new Error('rate-limited (gave up)');
}

async function search(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12` +
    `&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1100&format=json&origin=*`;
  const res = await fetchRetry(url, { headers: { 'Accept': 'application/json' } });
  const json = await res.json();
  return Object.values(json.query?.pages || {});
}

function pickBest(pages, keyword) {
  const bad = /(logo|map|diagram|chart|icon|sign|menu|recipe card|packet|raw |uncooked|ingredient)/i;
  const cand = pages
    .map(p => {
      const ii = p.imageinfo?.[0];
      if (!ii || !/jpeg|png/.test(ii.mime || '')) return null;
      const title = p.title || '';
      if (bad.test(title)) return null;
      if (!ii.thumburl || (ii.width || 0) < 640) return null;
      const km = title.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0;
      // prefer landscape-ish, decent resolution, keyword match
      const ratio = ii.width / ii.height;
      const ratioScore = ratio >= 1 && ratio <= 1.9 ? 1 : 0;
      const score = km * 100 + ratioScore * 10 + Math.min((ii.width || 0) / 1000, 6);
      return { p, ii, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  return cand[0];
}

async function download(url, file) {
  const res = await fetchRetry(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(file, buf);
  return buf.length;
}

// Resume: load any existing map/credits so we only fetch what's missing.
const mapPath = path.resolve('scripts/dish-image-map.json');
const credPath = path.resolve('src/data/imageCredits.json');
const map = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : {};
const credits = fs.existsSync(credPath) ? JSON.parse(fs.readFileSync(credPath, 'utf8')) : [];
const haveCredit = new Set(credits.map(c => c.dish));
const failures = [];

for (const [id, slug, q1, q2, keyword] of DISHES) {
  const file = path.join(OUT_DIR, `${slug}.jpg`);
  if (fs.existsSync(file) && map[id] && haveCredit.has(slug)) {
    console.log(`• ${slug}: already have`);
    continue;
  }

  let best = null;
  for (const q of [q1, q2]) {
    try {
      const pages = await search(q);
      best = pickBest(pages, keyword);
      if (best) break;
    } catch (e) { console.log(`  search "${q}" failed: ${e.message}`); }
    await sleep(800);
  }
  if (!best) { failures.push(slug); console.log(`✗ ${slug}: no match`); continue; }

  try {
    const bytes = await download(best.ii.thumburl, file);
    map[id] = `/images/dishes/${slug}.jpg`;
    const em = best.ii.extmetadata || {};
    if (!haveCredit.has(slug)) {
      credits.push({
        dish: slug,
        title: stripHtml(best.p.title.replace(/^File:/, '')),
        author: stripHtml(em.Artist?.value) || 'Unknown',
        license: stripHtml(em.LicenseShortName?.value) || 'CC',
        source: em.DescriptionUrl?.value || best.ii.descriptionurl || '',
      });
      haveCredit.add(slug);
    }
    console.log(`✓ ${slug}: ${(bytes / 1024).toFixed(0)}KB  (${best.ii.width}x${best.ii.height})`);
    // Persist after each success so a crash/throttle doesn't lose progress.
    fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
    fs.writeFileSync(credPath, JSON.stringify(credits, null, 2));
  } catch (e) {
    failures.push(slug);
    console.log(`✗ ${slug}: ${e.message}`);
  }
  await sleep(1200);
}

console.log(`\nDone. ${Object.keys(map).length}/${DISHES.length} images. Failures: ${failures.join(', ') || 'none'}`);

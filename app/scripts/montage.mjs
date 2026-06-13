// Build a labeled contact sheet of dish images for review.
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const DIR = path.resolve('public/images/dishes');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jpg')).sort();

const CELL = 230, PAD = 8, LABEL = 26, COLS = 5;
const rows = Math.ceil(files.length / COLS);
const W = COLS * CELL + (COLS + 1) * PAD;
const H = rows * (CELL + LABEL) + (rows + 1) * PAD;

const canvas = new Jimp(W, H, '#111111');
const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

for (let i = 0; i < files.length; i++) {
  const r = Math.floor(i / COLS), c = i % COLS;
  const x = PAD + c * (CELL + PAD);
  const y = PAD + r * (CELL + LABEL + PAD);
  const img = await Jimp.read(path.join(DIR, files[i]));
  img.cover(CELL, CELL);
  canvas.composite(img, x, y);
  canvas.print(font, x, y + CELL + 4, { text: files[i].replace('.jpg', ''), alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT }, CELL);
}

const out = path.resolve('montage.png');
await canvas.writeAsync(out);
console.log('wrote', out, W + 'x' + H);

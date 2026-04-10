import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { get } from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelsDir = join(__dirname, '..', 'public', 'models');

mkdirSync(modelsDir, { recursive: true });

const BASE_URL =
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
];

async function download(filename) {
  const url = `${BASE_URL}/${filename}`;
  const dest = join(modelsDir, filename);

  console.log(`Downloading ${filename}...`);

  await new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      pipeline(res, createWriteStream(dest)).then(resolve).catch(reject);
    }).on('error', reject);
  });

  console.log(`  -> saved to public/models/${filename}`);
}

for (const file of FILES) {
  await download(file);
}

console.log('\nDone! Model files are in public/models/');

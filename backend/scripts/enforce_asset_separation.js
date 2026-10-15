const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const FRONTEND_IMAGES = path.resolve(ROOT_DIR, 'frontend/public/images');
const BACKEND_UPLOADS = path.resolve(__dirname, '../uploads');

// 1. Static assets that MUST remain in frontend/public/images/
const STATIC_ASSETS = new Set([
  'hospital-exterior-banner.webp',
  'hospital-exterior.webp',
]);

// 2. Dynamic assets to ensure exist in backend/uploads/ and remove from frontend
function ensureInUploads(item) {
  const frontItem = path.join(FRONTEND_IMAGES, item);
  const backItem = path.join(BACKEND_UPLOADS, item);

  if (!fs.existsSync(frontItem)) return;

  const stat = fs.statSync(frontItem);
  if (stat.isDirectory()) {
    if (!fs.existsSync(backItem)) fs.mkdirSync(backItem, { recursive: true });
    const subFiles = fs.readdirSync(frontItem);
    for (const sf of subFiles) {
      const srcSub = path.join(frontItem, sf);
      const dstSub = path.join(backItem, sf);
      if (!fs.existsSync(dstSub)) {
        fs.copyFileSync(srcSub, dstSub);
        console.log(`[Uploads] Copied dynamic sub-asset: ${item}/${sf}`);
      }
    }
  } else {
    if (!fs.existsSync(backItem)) {
      fs.copyFileSync(frontItem, backItem);
      console.log(`[Uploads] Copied dynamic asset: ${item}`);
    }
  }
}

// 3. Clean frontend/public/images so only static assets remain
const allFrontendItems = fs.readdirSync(FRONTEND_IMAGES);
for (const item of allFrontendItems) {
  if (!STATIC_ASSETS.has(item)) {
    ensureInUploads(item);
    const itemPath = path.join(FRONTEND_IMAGES, item);
    fs.rmSync(itemPath, { recursive: true, force: true });
    console.log(`[Frontend Clean] Removed dynamic collection asset from frontend: ${item}`);
  }
}

console.log('\n--- Frontend Public Images Remaining ---');
console.log(fs.readdirSync(FRONTEND_IMAGES));

console.log('\n--- Backend Uploads Dynamic Collections ---');
console.log(fs.readdirSync(BACKEND_UPLOADS));

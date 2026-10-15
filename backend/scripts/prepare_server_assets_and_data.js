const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const FRONTEND_PUBLIC_IMAGES = path.resolve(ROOT_DIR, 'frontend/public/images');
const BACKEND_UPLOADS = path.resolve(__dirname, '../uploads');

// 1. Ensure all directories exist in uploads
const uploadSubdirs = ['departments', 'gallery', 'blogs', 'insurance'];
uploadSubdirs.forEach(sub => {
  const p = path.join(BACKEND_UPLOADS, sub);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Copy any missing files from frontend/public/images to backend/uploads
function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${entry.name} -> ${destDir}`);
      }
    }
  }
}

copyRecursive(FRONTEND_PUBLIC_IMAGES, BACKEND_UPLOADS);
console.log('All server-side dynamic upload assets verified in backend/uploads/');

// 2. Load db_dump.json and normalize dynamic asset URLs to /uploads/...
const dump = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_dump.json'), 'utf-8'));

function normalizeUrlToUploads(url) {
  if (typeof url !== 'string') return url;
  // If it starts with /images/, map to /uploads/
  if (url.startsWith('/images/')) {
    return url.replace('/images/', '/uploads/');
  }
  return url;
}

// Convert collections to /uploads/
['departments', 'specialties', 'treatments', 'doctors', 'facilities', 'blog_posts', 'gallery_items', 'insurance_providers', 'media_assets'].forEach(tableName => {
  if (!dump[tableName]) return;
  dump[tableName].rows.forEach(row => {
    ['image_url', 'photo_url', 'logo_url', 'media_url', 'thumbnail_url', 'url'].forEach(col => {
      if (row[col]) {
        row[col] = normalizeUrlToUploads(row[col]);
      }
    });
  });
});

fs.writeFileSync(path.join(__dirname, 'db_dump.json'), JSON.stringify(dump, null, 2), 'utf-8');
console.log('db_dump.json updated with server-side /uploads/ paths.');

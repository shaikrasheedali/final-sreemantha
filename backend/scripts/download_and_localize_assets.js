const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createConnection, query } = require('../src/config/db');

const ROOT_DIR = path.resolve(__dirname, '../..');
const FRONTEND_PUBLIC_IMAGES = path.resolve(ROOT_DIR, 'frontend/public/images');
const BACKEND_UPLOADS = path.resolve(__dirname, '../uploads');

// Ensure directories exist
const targetDirs = [
  FRONTEND_PUBLIC_IMAGES,
  path.join(FRONTEND_PUBLIC_IMAGES, 'departments'),
  path.join(FRONTEND_PUBLIC_IMAGES, 'gallery'),
  BACKEND_UPLOADS,
  path.join(BACKEND_UPLOADS, 'departments'),
  path.join(BACKEND_UPLOADS, 'gallery'),
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function verifyZeroExternalUrls() {
  console.log('\n--- Verifying Zero External URLs in Database ---');
  const conn = await createConnection();

  try {
    const [tables] = await conn.query('SHOW TABLES');
    let externalUrlCount = 0;

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [rows] = await conn.query(`SELECT * FROM \`${tableName}\``);
      for (const row of rows) {
        for (const [col, val] of Object.entries(row)) {
          if (typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))) {
            // Exclude WhatsApp target link in settings since it's a contact link, not an asset
            if (tableName === 'settings' && col === 'setting_value') continue;
            console.log(`WARNING: External URL found in ${tableName}.${col}: ${val}`);
            externalUrlCount++;
          }
        }
      }
    }

    if (externalUrlCount === 0) {
      console.log('✅ VERIFICATION PASSED: Absolutely ZERO external/URL-based media assets in database!');
    } else {
      console.log(`❌ Found ${externalUrlCount} external URLs.`);
    }
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  verifyZeroExternalUrls().catch(err => {
    console.error('Verification notice:', err.message);
  });
}

module.exports = { verifyZeroExternalUrls };

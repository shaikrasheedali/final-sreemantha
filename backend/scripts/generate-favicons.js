const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

async function generateFavicons() {
  const rootSvgPath = path.resolve(__dirname, '../../favicon.svg');
  const publicDir = path.resolve(__dirname, '../../frontend/public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const svgContent = fs.readFileSync(rootSvgPath, 'utf8');
  // Copy SVG to public
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('Copied favicon.svg to frontend/public/favicon.svg');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  const html = `<!DOCTYPE html><html><head><style>
    * { margin:0; padding:0; box-sizing: border-box; }
    html, body { width:100%; height:100%; overflow:hidden; background:transparent; display:flex; align-items:center; justify-content:center; }
    svg { width:100%; height:100%; display:block; }
  </style></head><body>${svgContent}</body></html>`;

  for (const item of sizes) {
    await page.setViewportSize({ width: item.size, height: item.size });
    await page.setContent(html, { waitUntil: 'load' });
    const buffer = await page.screenshot({ type: 'png', omitBackground: true });
    fs.writeFileSync(path.join(publicDir, item.name), buffer);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // Create favicon.ico from 16x16 and 32x32 PNGs
  const png16 = fs.readFileSync(path.join(publicDir, 'favicon-16x16.png'));
  const png32 = fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'));

  // ICO header: 0-1 reserved, 2-3 type (1 for ico), 4-5 number of images (2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(2, 4);

  const dir1 = Buffer.alloc(16);
  dir1.writeUInt8(16, 0); // width
  dir1.writeUInt8(16, 1); // height
  dir1.writeUInt8(0, 2);  // color palette
  dir1.writeUInt8(0, 3);  // reserved
  dir1.writeUInt16LE(1, 4); // color planes
  dir1.writeUInt16LE(32, 6); // bpp
  dir1.writeUInt32LE(png16.length, 8); // size
  dir1.writeUInt32LE(6 + 32, 12); // offset (header 6 + 2*16 = 38)

  const dir2 = Buffer.alloc(16);
  dir2.writeUInt8(32, 0); // width
  dir2.writeUInt8(32, 1); // height
  dir2.writeUInt8(0, 2);  // color palette
  dir2.writeUInt8(0, 3);  // reserved
  dir2.writeUInt16LE(1, 4); // color planes
  dir2.writeUInt16LE(32, 6); // bpp
  dir2.writeUInt32LE(png32.length, 8); // size
  dir2.writeUInt32LE(6 + 32 + png16.length, 12); // offset

  const icoBuffer = Buffer.concat([header, dir1, dir2, png16, png32]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico with 16x16 and 32x32 embedded PNGs');

  // Web manifest
  const manifest = {
    name: 'Sreemantha Hospital',
    short_name: 'Sreemantha',
    description: 'Sreemantha IVF, Women & Child Care Hospital - Khammam',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
    ],
    theme_color: '#183f3d',
    background_color: '#faf8f3',
    display: 'standalone',
    start_url: '/'
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated site.webmanifest');

  await browser.close();
}

generateFavicons().catch(e => { console.error(e); process.exit(1); });

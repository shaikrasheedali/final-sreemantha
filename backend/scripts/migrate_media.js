const { query } = require('../src/config/db');

async function runMigration() {
  console.log('Starting migration...');
  
  await query(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      file_size INT NOT NULL DEFAULT 0,
      mime_type VARCHAR(100) NOT NULL DEFAULT 'image/webp',
      media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
      width INT DEFAULT NULL,
      height INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('media_assets table verified/created.');

  try {
    await query('ALTER TABLE specialties MODIFY image_url TEXT');
    await query('ALTER TABLE treatments MODIFY image_url TEXT');
    await query('ALTER TABLE doctors MODIFY photo_url TEXT');
    await query('ALTER TABLE facilities MODIFY image_url TEXT');
    await query('ALTER TABLE blog_posts MODIFY image_url TEXT');
    await query('ALTER TABLE gallery_items MODIFY media_url TEXT');
    console.log('All image columns altered to TEXT successfully.');
  } catch (err) {
    console.warn('Column modification notice:', err.message);
  }

  // Check existing records in media_assets
  const existing = await query('SELECT COUNT(*) as cnt FROM media_assets');
  console.log(`Current media_assets count: ${existing[0].cnt}`);

  // If 0, populate with existing media from collections and gallery so that
  // "all uploaded images and videos assets that are currently in the app are displayed"
  if (existing[0].cnt === 0) {
    console.log('Seeding initial media assets from current app collections...');
    const seedUrls = new Set();

    const spec = await query("SELECT image_url, title FROM specialties WHERE image_url IS NOT NULL AND image_url != ''");
    spec.forEach(r => seedUrls.add(JSON.stringify({ url: r.image_url, name: r.title + ' Image', type: 'image' })));

    const trt = await query("SELECT image_url, title FROM treatments WHERE image_url IS NOT NULL AND image_url != ''");
    trt.forEach(r => seedUrls.add(JSON.stringify({ url: r.image_url, name: r.title + ' Image', type: 'image' })));

    const doc = await query("SELECT photo_url, name FROM doctors WHERE photo_url IS NOT NULL AND photo_url != ''");
    doc.forEach(r => seedUrls.add(JSON.stringify({ url: r.photo_url, name: 'Dr. ' + r.name + ' Photo', type: 'image' })));

    const fac = await query("SELECT image_url, name FROM facilities WHERE image_url IS NOT NULL AND image_url != ''");
    fac.forEach(r => seedUrls.add(JSON.stringify({ url: r.image_url, name: r.name + ' Facility', type: 'image' })));

    const post = await query("SELECT image_url, title FROM blog_posts WHERE image_url IS NOT NULL AND image_url != ''");
    post.forEach(r => seedUrls.add(JSON.stringify({ url: r.image_url, name: r.title + ' Banner', type: 'image' })));

    const gal = await query("SELECT media_url, title, media_type FROM gallery_items WHERE media_url IS NOT NULL AND media_url != ''");
    gal.forEach(r => seedUrls.add(JSON.stringify({ url: r.media_url, name: r.title, type: r.media_type === 'video' ? 'video' : 'image' })));

    for (const itemStr of seedUrls) {
      const item = JSON.parse(itemStr);
      if (!item.url || item.url.startsWith('[')) continue;
      const filename = item.url.split('/').pop().split('?')[0] || 'asset.webp';
      await query(
        `INSERT INTO media_assets (filename, original_name, url, file_size, mime_type, media_type, width, height)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          filename,
          item.name || filename,
          item.url,
          102400, // estimated 100kb
          item.type === 'video' ? 'video/mp4' : 'image/webp',
          item.type === 'video' ? 'video' : 'image',
          1200,
          800
        ]
      );
    }
    console.log('Seeded initial media assets from active collections.');
  }

  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

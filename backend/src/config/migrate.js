const fs = require('fs');
const path = require('path');
const { query } = require('./db');

async function initDatabaseIfEmpty() {
  try {
    const tables = await query("SHOW TABLES LIKE 'users'");
    if (!tables || tables.length === 0) {
      console.log('[Migration] Database appears empty. Initializing complete schema from database_godaddy_export.sql...');
      const sqlFilePath = path.resolve(__dirname, '../../database_godaddy_export.sql');
      if (fs.existsSync(sqlFilePath)) {
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
        const statements = sqlContent
          .split(/;\s*[\r\n]+/)
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
          if (stmt.trim()) {
            await query(stmt);
          }
        }
        console.log('[Migration] All tables and baseline data initialized successfully.');
      }
    }
  } catch (err) {
    console.log('[Migration] Auto-init notice:', err.message);
  }
}

async function runMigrations() {
  console.log('[Migration] Checking table schema updates...');

  await initDatabaseIfEmpty();

  try {
    await query("ALTER TABLE gallery_items MODIFY COLUMN media_type VARCHAR(50) DEFAULT 'image';");
    console.log('[Migration] Updated gallery_items.media_type to VARCHAR(50)');
  } catch (err) {
    // Column might already be modified or not needed
  }

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN embed_code TEXT NULL AFTER media_url;');
    console.log('[Migration] Added gallery_items.embed_code');
  } catch (err) {
    // Column might already exist
  }

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER embed_code;');
    console.log('[Migration] Added gallery_items.thumbnail_url');
  } catch (err) {
    // Column might already exist
  }

  try {
    await query('ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;');
    console.log('[Migration] Updated appointments.preferred_date to allow NULL');
  } catch (err) {
    // Column might already be updated
  }

  try {
    await query("ALTER TABLE appointments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'waiting';");
    console.log('[Migration] Updated appointments.status to VARCHAR(50) DEFAULT waiting');
  } catch (err) {
    // Column might already be updated
  }

  try {
    await query("ALTER TABLE enquiries MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'unread';");
    console.log('[Migration] Updated enquiries.status to VARCHAR(50) DEFAULT unread');
  } catch (err) {
    // Column might already be updated
  }

  try {
    await query('ALTER TABLE users ADD COLUMN stored_password VARCHAR(255) NULL AFTER password_hash;');
    console.log('[Migration] Added users.stored_password');
  } catch (err) {
    // Column might already exist
  }

  console.log('[Migration] Finished schema migrations.');
}

module.exports = { runMigrations, initDatabaseIfEmpty };

if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

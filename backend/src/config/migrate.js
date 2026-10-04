const { query } = require('./db');

async function runMigrations() {
  console.log('[Migration] Checking table schema updates...');

  try {
    await query("ALTER TABLE gallery_items MODIFY COLUMN media_type VARCHAR(50) DEFAULT 'image';");
    console.log('[Migration] Updated gallery_items.media_type to VARCHAR(50)');
  } catch (err) {
    // Column might already be modified
    console.log('[Migration] media_type:', err.message);
  }

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN embed_code TEXT NULL AFTER media_url;');
    console.log('[Migration] Added gallery_items.embed_code');
  } catch (err) {
    // Column might already exist
    console.log('[Migration] embed_code:', err.message);
  }

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER embed_code;');
    console.log('[Migration] Added gallery_items.thumbnail_url');
  } catch (err) {
    console.log('[Migration] thumbnail_url:', err.message);
  }

  try {
    await query('ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;');
    console.log('[Migration] Updated appointments.preferred_date to allow NULL');
  } catch (err) {
    console.log('[Migration] appointments.preferred_date:', err.message);
  }

  try {
    await query("ALTER TABLE appointments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'waiting';");
    console.log('[Migration] Updated appointments.status to VARCHAR(50) DEFAULT waiting');
  } catch (err) {
    console.log('[Migration] appointments.status:', err.message);
  }

  try {
    await query("ALTER TABLE enquiries MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'unread';");
    console.log('[Migration] Updated enquiries.status to VARCHAR(50) DEFAULT unread');
  } catch (err) {
    console.log('[Migration] enquiries.status:', err.message);
  }

  try {
    await query('ALTER TABLE users ADD COLUMN stored_password VARCHAR(255) NULL AFTER password_hash;');
    console.log('[Migration] Added users.stored_password');
  } catch (err) {
    console.log('[Migration] users.stored_password:', err.message);
  }

  console.log('[Migration] Finished schema migrations.');
}

module.exports = { runMigrations };

if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

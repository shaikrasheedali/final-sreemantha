const fs = require('fs');
const path = require('path');
const { query } = require('./db');
const { seedInitialUsers } = require('./seed');

const TABLE_DEFINITIONS = {
  users: `
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`username\` varchar(100) NOT NULL,
      \`email\` varchar(255) NOT NULL,
      \`password_hash\` varchar(255) NOT NULL,
      \`stored_password\` varchar(255) NULL,
      \`role\` enum('superadmin','admin','staff') NOT NULL DEFAULT 'staff',
      \`full_name\` varchar(255) NOT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`username\` (\`username\`),
      UNIQUE KEY \`email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  departments: `
    CREATE TABLE IF NOT EXISTS \`departments\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(120) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`tagline\` varchar(255) DEFAULT NULL,
      \`description\` longtext,
      \`head_doctor_name\` varchar(255) DEFAULT NULL,
      \`icon\` varchar(100) DEFAULT NULL,
      \`image_url\` varchar(500) DEFAULT NULL,
      \`status\` enum('draft','published') DEFAULT 'published',
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  specialties: `
    CREATE TABLE IF NOT EXISTS \`specialties\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(120) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`category\` varchar(100) NOT NULL,
      \`short_description\` text,
      \`overview\` longtext,
      \`icon\` varchar(100) DEFAULT NULL,
      \`image_url\` text,
      \`conditions\` json DEFAULT NULL,
      \`display_order\` int DEFAULT '0',
      \`status\` enum('draft','published') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  treatments: `
    CREATE TABLE IF NOT EXISTS \`treatments\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(120) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`category\` varchar(100) NOT NULL,
      \`specialty_slug\` varchar(120) NOT NULL,
      \`short_description\` text,
      \`overview\` longtext,
      \`how_it_works\` json DEFAULT NULL,
      \`who_requires\` json DEFAULT NULL,
      \`preparation\` text,
      \`aftercare\` text,
      \`typical_duration\` varchar(255) DEFAULT NULL,
      \`success_rate\` varchar(255) DEFAULT NULL,
      \`image_url\` text,
      \`featured\` tinyint(1) DEFAULT '0',
      \`status\` enum('draft','published') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  doctors: `
    CREATE TABLE IF NOT EXISTS \`doctors\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(120) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`designation\` varchar(255) NOT NULL,
      \`department\` varchar(100) NOT NULL,
      \`qualifications\` varchar(255) NOT NULL,
      \`experience_years\` int NOT NULL,
      \`languages\` json DEFAULT NULL,
      \`short_bio\` text,
      \`full_bio\` longtext,
      \`education\` json DEFAULT NULL,
      \`certifications\` json DEFAULT NULL,
      \`opd_timings\` varchar(255) DEFAULT NULL,
      \`photo_url\` text,
      \`featured\` tinyint(1) DEFAULT '0',
      \`display_order\` int DEFAULT '0',
      \`status\` enum('draft','published') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  facilities: `
    CREATE TABLE IF NOT EXISTS \`facilities\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(120) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`short_description\` text,
      \`description\` longtext,
      \`equipment\` json DEFAULT NULL,
      \`image_url\` text,
      \`status\` enum('draft','published') DEFAULT 'published',
      \`display_order\` int DEFAULT '0',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  blog_posts: `
    CREATE TABLE IF NOT EXISTS \`blog_posts\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(150) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`category\` varchar(100) NOT NULL,
      \`author\` varchar(100) NOT NULL,
      \`read_time\` varchar(50) DEFAULT '5 min read',
      \`summary\` text,
      \`content\` longtext NOT NULL,
      \`image_url\` text,
      \`published_at\` date DEFAULT NULL,
      \`featured\` tinyint(1) DEFAULT '0',
      \`status\` enum('draft','published') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  gallery_items: `
    CREATE TABLE IF NOT EXISTS \`gallery_items\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`title\` varchar(255) NOT NULL,
      \`category\` varchar(100) NOT NULL,
      \`media_type\` varchar(50) DEFAULT 'image',
      \`media_url\` text,
      \`embed_code\` text,
      \`thumbnail_url\` varchar(500) DEFAULT NULL,
      \`caption\` text,
      \`display_order\` int DEFAULT '0',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  insurance_providers: `
    CREATE TABLE IF NOT EXISTS \`insurance_providers\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`type\` varchar(100) NOT NULL,
      \`cashless_available\` tinyint(1) DEFAULT '1',
      \`claim_assistance_info\` text,
      \`logo_url\` varchar(500) DEFAULT NULL,
      \`display_order\` int DEFAULT '0',
      \`status\` enum('active','inactive') DEFAULT 'active',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  settings: `
    CREATE TABLE IF NOT EXISTS \`settings\` (
      \`setting_key\` varchar(100) NOT NULL,
      \`setting_value\` json NOT NULL,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`setting_key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  faqs: `
    CREATE TABLE IF NOT EXISTS \`faqs\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`question\` varchar(500) NOT NULL,
      \`answer\` longtext NOT NULL,
      \`category\` varchar(100) NOT NULL,
      \`display_order\` int DEFAULT '0',
      \`status\` enum('draft','published') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  testimonials: `
    CREATE TABLE IF NOT EXISTS \`testimonials\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`patient_name\` varchar(255) NOT NULL,
      \`location\` varchar(100) NOT NULL,
      \`treatment_category\` varchar(100) NOT NULL,
      \`rating\` int DEFAULT '5',
      \`story\` longtext NOT NULL,
      \`consent_verified\` tinyint(1) DEFAULT '1',
      \`status\` enum('published','draft') DEFAULT 'published',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  media_assets: `
    CREATE TABLE IF NOT EXISTS \`media_assets\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`filename\` varchar(255) NOT NULL,
      \`original_name\` varchar(255) NOT NULL,
      \`url\` varchar(500) NOT NULL,
      \`file_size\` int NOT NULL DEFAULT '0',
      \`mime_type\` varchar(100) NOT NULL DEFAULT 'image/webp',
      \`media_type\` enum('image','video') NOT NULL DEFAULT 'image',
      \`width\` int DEFAULT NULL,
      \`height\` int DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  appointments: `
    CREATE TABLE IF NOT EXISTS \`appointments\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`patient_name\` varchar(255) NOT NULL,
      \`phone\` varchar(50) NOT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`department\` varchar(100) NOT NULL,
      \`doctor_name\` varchar(255) DEFAULT NULL,
      \`preferred_date\` date DEFAULT NULL,
      \`preferred_time\` varchar(50) NOT NULL,
      \`reason\` text,
      \`status\` varchar(50) NOT NULL DEFAULT 'waiting',
      \`notes\` text,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  enquiries: `
    CREATE TABLE IF NOT EXISTS \`enquiries\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`phone\` varchar(50) NOT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`subject\` varchar(255) DEFAULT NULL,
      \`message\` text NOT NULL,
      \`status\` varchar(50) NOT NULL DEFAULT 'unread',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  audit_logs: `
    CREATE TABLE IF NOT EXISTS \`audit_logs\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`user_id\` int DEFAULT NULL,
      \`action\` varchar(100) NOT NULL,
      \`entity\` varchar(100) NOT NULL,
      \`entity_id\` varchar(100) DEFAULT NULL,
      \`details\` json DEFAULT NULL,
      \`ip_address\` varchar(50) DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
};

async function initDatabase() {
  console.log('[InitDb] Verifying and provisioning MySQL database tables...');

  // 1. Create all 16 tables individually
  for (const [tableName, ddl] of Object.entries(TABLE_DEFINITIONS)) {
    try {
      await query(ddl);
      console.log(`[InitDb] Table verified: ${tableName}`);
    } catch (err) {
      console.error(`[InitDb] Warning creating table ${tableName}:`, err.message);
    }
  }

  // 2. Check and run schema column updates
  try {
    await query("ALTER TABLE gallery_items MODIFY COLUMN media_type VARCHAR(50) DEFAULT 'image';");
  } catch (e) {}

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN embed_code TEXT NULL AFTER media_url;');
  } catch (e) {}

  try {
    await query('ALTER TABLE gallery_items ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER embed_code;');
  } catch (e) {}

  try {
    await query('ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;');
  } catch (e) {}

  try {
    await query("ALTER TABLE appointments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'waiting';");
  } catch (e) {}

  try {
    await query("ALTER TABLE enquiries MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'unread';");
  } catch (e) {}

  try {
    await query('ALTER TABLE users ADD COLUMN stored_password VARCHAR(255) NULL AFTER password_hash;');
  } catch (e) {}

  // 3. Seed baseline content tables if empty
  const baselinePath = path.join(__dirname, 'baseline_data.json');
  if (fs.existsSync(baselinePath)) {
    try {
      const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));

      for (const [tableName, rows] of Object.entries(baseline)) {
        if (!rows || rows.length === 0) continue;

        try {
          const countResult = await query(`SELECT COUNT(*) as cnt FROM \`${tableName}\``);
          const count = countResult[0]?.cnt || 0;

          if (count === 0) {
            console.log(`[InitDb] Seeding empty table \`${tableName}\` with ${rows.length} baseline records...`);
            
            for (const row of rows) {
              const cols = Object.keys(row);
              const placeholders = cols.map(() => '?').join(', ');
              const values = cols.map(c => {
                const val = row[c];
                if (val !== null && typeof val === 'object') {
                  return JSON.stringify(val);
                }
                return val;
              });

              await query(
                `INSERT INTO \`${tableName}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
                values
              );
            }
            console.log(`[InitDb] Successfully seeded table: ${tableName}`);
          }
        } catch (tableErr) {
          console.error(`[InitDb] Notice seeding table ${tableName}:`, tableErr.message);
        }
      }
    } catch (baselineErr) {
      console.error('[InitDb] Error loading baseline data:', baselineErr.message);
    }
  }

  // 4. Seed initial superadmin, admin, staff users
  await seedInitialUsers();

  console.log('[InitDb] Database initialization check completed successfully.');
}

module.exports = { initDatabase };

if (require.main === module) {
  initDatabase().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

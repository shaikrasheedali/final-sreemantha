const fs = require('fs');
const path = require('path');
const { withConnection } = require('./db');
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
      \`how_it_works\` longtext,
      \`who_requires\` longtext,
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
      \`user_name\` varchar(100) NOT NULL,
      \`action\` varchar(255) NOT NULL,
      \`entity_type\` varchar(100) NOT NULL,
      \`entity_id\` varchar(100) DEFAULT NULL,
      \`details\` json DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
};

const SCHEMA_UPGRADES = [
  "ALTER TABLE gallery_items MODIFY COLUMN media_type VARCHAR(50) DEFAULT 'image'",
  'ALTER TABLE gallery_items ADD COLUMN embed_code TEXT NULL AFTER media_url',
  'ALTER TABLE gallery_items ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER embed_code',
  'ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL',
  "ALTER TABLE appointments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'waiting'",
  "ALTER TABLE enquiries MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'unread'",
  'ALTER TABLE users ADD COLUMN stored_password VARCHAR(255) NULL AFTER password_hash',
  // how_it_works is authored as rich HTML in the CMS, while who_requires may
  // be JSON or plain text. Both must not be constrained to valid JSON.
  'ALTER TABLE treatments MODIFY COLUMN how_it_works LONGTEXT NULL',
  'ALTER TABLE treatments MODIFY COLUMN who_requires LONGTEXT NULL',
  // Compatibility with the previous audit_logs definition.
  'ALTER TABLE audit_logs ADD COLUMN user_name VARCHAR(100) NULL',
  'ALTER TABLE audit_logs ADD COLUMN entity_type VARCHAR(100) NULL',
  'ALTER TABLE audit_logs MODIFY COLUMN entity VARCHAR(100) NULL',
];

function isExpectedSchemaError(err) {
  // Duplicate column / duplicate key / missing old column are expected while
  // bringing an existing database up to the current schema.
  return ['ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME', 'ER_CANT_DROP_FIELD_OR_KEY', 'ER_BAD_FIELD_ERROR'].includes(
    err && err.code
  );
}

// The retired reception/newborn photograph must never be served again. Its
// CMS image slots now use the approved Sreemantha brand artwork. The rewrite
// is idempotent and runs at boot so existing hosted databases are cleaned up
// in place, not just fresh installs seeded from baseline_data.json.
const LEGACY_MEDIA_REWRITES = [
  ['/reception-newborn-card.webp', '/sreemantha-brand-logo-square.webp'],
  ['/reception-newborn.webp', '/sreemantha-brand-logo-card.webp'],
];

const LEGACY_MEDIA_COLUMNS = [
  ['departments', 'image_url'],
  ['specialties', 'image_url'],
  ['treatments', 'image_url'],
  ['doctors', 'photo_url'],
  ['facilities', 'image_url'],
  ['blog_posts', 'image_url'],
  ['blog_posts', 'content'],
  ['gallery_items', 'media_url'],
  ['gallery_items', 'thumbnail_url'],
  ['gallery_items', 'embed_code'],
  ['media_assets', 'url'],
];

function rewriteLegacyMediaValue(value) {
  return LEGACY_MEDIA_REWRITES.reduce(
    (current, [from, to]) => current.split(from).join(to),
    String(value)
  );
}

async function migrateLegacyBrandMedia(run) {
  let rewrittenColumns = 0;

  for (const [table, column] of LEGACY_MEDIA_COLUMNS) {
    try {
      const result = await run(
        `UPDATE \`${table}\` SET \`${column}\` = REPLACE(REPLACE(\`${column}\`,
            '/reception-newborn-card.webp', '/sreemantha-brand-logo-square.webp'),
            '/reception-newborn.webp', '/sreemantha-brand-logo-card.webp')
          WHERE \`${column}\` LIKE '%reception-newborn%'`
      );
      if (result && result.affectedRows) rewrittenColumns += 1;
    } catch (err) {
      if (!isExpectedSchemaError(err)) {
        console.error(`[InitDb] Legacy media cleanup notice (${table}.${column}):`, err.message);
      }
    }
  }

  // Remove the retired photograph from the CMS media library entirely.
  try {
    await run(
      `DELETE FROM media_assets
        WHERE filename IN ('reception-newborn.webp', 'reception-newborn-card.webp')
           OR original_name LIKE '%Newborn Mom & Staff%'`
    );
  } catch (err) {
    console.error('[InitDb] Legacy media asset cleanup notice:', err.message);
  }

  // Rename the previously uploaded, untitled logo asset to a stable,
  // descriptive production filename. Fresh databases already contain this
  // row from baseline_data.json, so the update is a no-op there.
  try {
    await run(
      `UPDATE media_assets
          SET filename = 'sreemantha-brand-logo.webp',
              original_name = 'Sreemantha Fertility, Women & Child Care Hospital Logo',
              url = '/uploads/sreemantha-brand-logo.webp',
              file_size = 118876,
              mime_type = 'image/webp',
              media_type = 'image',
              width = 2400,
              height = 1350
        WHERE filename = 'asset-1791049250066-295820097.webp'
           OR original_name = 'Untitled image (2).jpeg'`
    );

    const [{ count: logoCount } = { count: 0 }] = await run(
      `SELECT COUNT(*) AS count FROM media_assets WHERE filename = 'sreemantha-brand-logo.webp'`
    );
    if (Number(logoCount) === 0) {
      await run(
        `INSERT INTO media_assets
          (filename, original_name, url, file_size, mime_type, media_type, width, height)
         VALUES (?, ?, ?, ?, 'image/webp', 'image', ?, ?)`,
        [
          'sreemantha-brand-logo.webp',
          'Sreemantha Fertility, Women & Child Care Hospital Logo',
          '/uploads/sreemantha-brand-logo.webp',
          118876,
          2400,
          1350,
        ]
      );
    }
  } catch (err) {
    console.error('[InitDb] Logo media asset registration notice:', err.message);
  }

  // Settings are stored as JSON and may embed a media path inside copy.
  try {
    const settingsRows = await run(
      `SELECT setting_key, setting_value FROM settings
        WHERE CAST(setting_value AS CHAR) LIKE '%reception-newborn%'`
    );
    for (const row of settingsRows) {
      const serialized =
        typeof row.setting_value === 'string'
          ? row.setting_value
          : JSON.stringify(row.setting_value);
      await run('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [
        rewriteLegacyMediaValue(serialized),
        row.setting_key,
      ]);
    }
  } catch (err) {
    console.error('[InitDb] Settings media cleanup notice:', err.message);
  }

  if (rewrittenColumns > 0) {
    console.log(
      `[InitDb] Replaced retired reception photograph references in ${rewrittenColumns} content column(s).`
    );
  }
}

async function initDatabase() {
  console.log('[InitDb] Verifying and provisioning MySQL database tables...');

  return withConnection(async (connection) => {
    const run = async (sql, params) => {
      const [rows] = await connection.query(sql, params);
      return rows;
    };

    // 1. Create all tables individually so one failure cannot abort the boot.
    let createdOrVerified = 0;
    for (const [tableName, ddl] of Object.entries(TABLE_DEFINITIONS)) {
      try {
        await run(ddl);
        createdOrVerified += 1;
      } catch (err) {
        console.error(`[InitDb] Warning creating table ${tableName}:`, err.message);
      }
    }

    // 2. Apply backwards-compatible schema upgrades.
    for (const statement of SCHEMA_UPGRADES) {
      try {
        await run(statement);
      } catch (err) {
        if (!isExpectedSchemaError(err)) {
          console.error('[InitDb] Schema update notice:', err.message);
        }
      }
    }

    // 3. Backfill audit rows written by the previous schema.
    try {
      await run(
        `UPDATE audit_logs
            SET user_name = COALESCE(user_name, 'System'),
                entity_type = COALESCE(entity_type, entity)
          WHERE user_name IS NULL OR entity_type IS NULL`
      );
    } catch (err) {
      // The old column may not exist on a freshly-created database.
      if (!isExpectedSchemaError(err)) {
        console.error('[InitDb] Audit backfill notice:', err.message);
      }
    }

    // 4. Seed baseline content tables only when they are empty.
    const baselinePath = path.join(__dirname, 'baseline_data.json');
    if (fs.existsSync(baselinePath)) {
      try {
        const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));

        for (const [tableName, rows] of Object.entries(baseline)) {
          if (!rows || rows.length === 0) continue;

          try {
            const countResult = await run(`SELECT COUNT(*) as cnt FROM \`${tableName}\``);
            const count = Number(countResult[0]?.cnt || 0);

            if (count === 0) {
              console.log(
                `[InitDb] Seeding empty table \`${tableName}\` with ${rows.length} baseline records...`
              );

              let inserted = 0;
              for (const row of rows) {
                const cols = Object.keys(row);
                const placeholders = cols.map(() => '?').join(', ');
                const values = cols.map((c) => {
                  const val = row[c];
                  if (val !== null && typeof val === 'object') {
                    return JSON.stringify(val);
                  }
                  return val;
                });

                try {
                  await run(
                    `INSERT INTO \`${tableName}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
                    values
                  );
                  inserted += 1;
                } catch (rowErr) {
                  // Keep seeding the remaining rows; a single malformed
                  // baseline record must not leave a whole table empty.
                  console.error(
                    `[InitDb] Could not seed ${tableName} row ${row.id ?? inserted + 1}:`,
                    rowErr.message
                  );
                }
              }
              console.log(
                `[InitDb] Seeded ${inserted}/${rows.length} records into table: ${tableName}`
              );
            }
          } catch (tableErr) {
            console.error(`[InitDb] Notice seeding table ${tableName}:`, tableErr.message);
          }
        }
      } catch (baselineErr) {
        console.error('[InitDb] Error loading baseline data:', baselineErr.message);
      }
    }

    // 5. Replace every remaining reference to the retired reception/newborn
    //    photograph, including rows that existed before this deploy.
    await migrateLegacyBrandMedia(run);

    // 6. Seed initial superadmin, admin and staff users without ever
    //    overwriting an existing account.
    await seedInitialUsers(connection);

    console.log(
      `[InitDb] Database initialization completed (${createdOrVerified}/${Object.keys(TABLE_DEFINITIONS).length} tables verified).`
    );

    return { tablesVerified: createdOrVerified };
  });
}

module.exports = { initDatabase };

if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

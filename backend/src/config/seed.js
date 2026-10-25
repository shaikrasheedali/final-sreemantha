const { query } = require('./db');
const { hashPassword } = require('../utils/security');

/**
 * Creates the initial staff accounts only when they do not already exist.
 *
 * Existing accounts are never overwritten. This is important in production:
 * a redeploy must not reset a password (or role) that an administrator has
 * deliberately changed.
 */
async function seedInitialUsers(connection = null) {
  const run = connection
    ? async (sql, params) => {
        const [rows] = await connection.query(sql, params);
        return rows;
      }
    : query;

  const defaultUsers = [
    {
      username: 'superadmin',
      email: 'superadmin@sreemantha.hospital',
      plainPassword: process.env.SEED_SUPERADMIN_PASSWORD || 'SuperAdmin@2026',
      role: 'superadmin',
      full_name: 'Chief Medical Director (Super Admin)',
    },
    {
      username: 'admin',
      email: 'admin@sreemantha.hospital',
      plainPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin@2026',
      role: 'admin',
      full_name: 'Hospital Administrator',
    },
    {
      username: 'staff',
      email: 'staff@sreemantha.hospital',
      plainPassword: process.env.SEED_STAFF_PASSWORD || 'Staff@2026',
      role: 'staff',
      full_name: 'Clinical Operations Staff',
    },
  ];

  let created = 0;

  try {
    for (const u of defaultUsers) {
      const existing = await run(
        'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
        [u.username, u.email]
      );

      if (existing.length > 0) {
        continue;
      }

      const argonHash = await hashPassword(u.plainPassword);
      await run(
        `INSERT INTO users (username, email, password_hash, stored_password, role, full_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.username, u.email, argonHash, u.plainPassword, u.role, u.full_name]
      );
      created += 1;
      console.log(`[Seed] Created ${u.role} user: ${u.username}`);
    }

    if (created > 0) {
      console.log('[Seed] Initial user accounts created successfully.');
      if (process.env.NODE_ENV === 'production' && !process.env.SEED_SUPERADMIN_PASSWORD) {
        console.warn(
          '[Seed] SECURITY NOTICE: default seed passwords are active. ' +
            'Sign in and change every account password, or set SEED_*_PASSWORD secrets before first deploy.'
        );
      }
    } else {
      console.log('[Seed] Existing user accounts preserved (no password reset performed).');
    }
  } catch (err) {
    console.error('[Seed] Error seeding users:', err.message);
  }
}

module.exports = {
  seedInitialUsers,
};

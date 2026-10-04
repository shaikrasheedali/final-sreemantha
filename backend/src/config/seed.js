const { query } = require('./db');
const { hashPassword } = require('../utils/security');

async function seedInitialUsers() {
  try {
    const defaultUsers = [
      {
        username: 'superadmin',
        email: 'superadmin@sreemantha.hospital',
        plainPassword: 'SuperAdmin@2026',
        role: 'superadmin',
        full_name: 'Chief Medical Director (Super Admin)',
      },
      {
        username: 'admin',
        email: 'admin@sreemantha.hospital',
        plainPassword: 'Admin@2026',
        role: 'admin',
        full_name: 'Hospital Administrator',
      },
      {
        username: 'staff',
        email: 'staff@sreemantha.hospital',
        plainPassword: 'Staff@2026',
        role: 'staff',
        full_name: 'Clinical Operations Staff',
      },
    ];

    for (const u of defaultUsers) {
      const existing = await query('SELECT id, password_hash FROM users WHERE username = ? OR email = ?', [u.username, u.email]);
      const argonHash = await hashPassword(u.plainPassword);

      if (existing.length === 0) {
        await query(
          'INSERT INTO users (username, email, password_hash, stored_password, role, full_name) VALUES (?, ?, ?, ?, ?, ?)',
          [u.username, u.email, argonHash, u.plainPassword, u.role, u.full_name]
        );
        console.log(`[Seed] Created ${u.role} user: ${u.username}`);
      } else {
        // Update password to known Argon2 hash and stored_password
        await query(
          'UPDATE users SET password_hash = ?, stored_password = ?, role = ?, full_name = ? WHERE id = ?',
          [argonHash, u.plainPassword, u.role, u.full_name, existing[0].id]
        );
        console.log(`[Seed] Updated ${u.role} user: ${u.username} with Argon2 hash & stored password`);
      }
    }

    console.log('[Seed] User accounts verified successfully.');
  } catch (err) {
    console.error('[Seed] Error seeding users:', err.message);
  }
}

module.exports = {
  seedInitialUsers,
};

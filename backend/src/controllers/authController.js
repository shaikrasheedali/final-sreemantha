const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { verifyPassword, hashPassword, generateToken } = require('../utils/security');
const { recordAudit, normalizeRole } = require('../middleware/auth');

async function login(req, res) {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/email and password are required.' });
    }

    const users = await query(
      'SELECT id, username, email, password_hash, role, full_name FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = users[0];
    const isMatch = await verifyPassword(user.password_hash, password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // If password was matched via legacy bcrypt, upgrade to Argon2
    if (!user.password_hash.startsWith('$argon2')) {
      try {
        const newArgonHash = await hashPassword(password);
        await query('UPDATE users SET password_hash = ? WHERE id = ?', [newArgonHash, user.id]);
        console.log(`[Auth] Upgraded password hash to Argon2 for user ${user.username}`);
      } catch (err) {
        logger.error('Password hash upgrade error:', err.message, 'AUTH');
      }
    }

    const token = generateToken(user);

    await recordAudit(user.username, 'LOGIN', 'users', user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: normalizeRole(user.role),
        displayRole: user.role,
        fullName: user.full_name,
      },
    });
  } catch (err) {
    logger.error('Login error:', err, 'AUTH');
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

async function getMe(req, res) {
  try {
    const users = await query(
      'SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = users[0];
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: normalizeRole(user.role),
        displayRole: user.role,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    logger.error('Get me error:', err, 'AUTH');
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function listUsers(req, res) {
  try {
    const users = await query('SELECT id, username, email, stored_password, role, full_name, created_at FROM users ORDER BY id ASC');
    const currentUserRole = normalizeRole(req.user?.role);

    return res.json({
      users: users.map(u => {
        const userRole = normalizeRole(u.role);
        let visiblePassword = null;
        // Superadmin can view the recorded credential for all accounts.
        // Never fall back to a known default password here: doing so would
        // disclose a password that is no longer valid or was never set.
        if (currentUserRole === 'superadmin') {
          visiblePassword = u.stored_password || null;
        } else if (currentUserRole === 'admin') {
          // Admin sees credentials for staff accounts only.
          if (userRole === 'staff') {
            visiblePassword = u.stored_password || null;
          }
        }

        return {
          id: u.id,
          username: u.username,
          name: u.full_name,
          email: u.email,
          role: userRole,
          displayRole: u.role,
          fullName: u.full_name,
          password: visiblePassword,
          stored_password: visiblePassword,
          createdAt: u.created_at,
          created_at: u.created_at,
        };
      }),
    });
  } catch (err) {
    logger.error('List users error:', err, 'AUTH');
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, role, fullName } = req.body;
    const currentUserRole = normalizeRole(req.user?.role);

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required.' });
    }

    const targetRole = normalizeRole(role);
    if (currentUserRole === 'admin' && targetRole !== 'staff') {
      return res.status(403).json({ error: 'Admins are only authorized to create Staff accounts.' });
    }

    const existing = await query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A user with that username or email already exists.' });
    }

    const argonHash = await hashPassword(password);
    const result = await query(
      'INSERT INTO users (username, email, password_hash, stored_password, role, full_name) VALUES (?, ?, ?, ?, ?, ?)',
      [username.trim(), email.trim(), argonHash, password, targetRole, (fullName || username).trim()]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'users', result.insertId, {
      username,
      role: targetRole,
    });

    return res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      user: {
        id: result.insertId,
        username,
        name: fullName || username,
        email,
        role: targetRole,
        displayRole: role,
        fullName: fullName || username,
        password,
        stored_password: password,
      },
    });
  } catch (err) {
    logger.error('Create user error:', err, 'AUTH');
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, password, role, fullName } = req.body;
    const currentUserRole = normalizeRole(req.user?.role);

    const existing = await query('SELECT id, username, email, role, full_name, password_hash, stored_password FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const targetUser = existing[0];
    const targetRole = normalizeRole(targetUser.role);

    // Admin can only edit staff accounts
    if (currentUserRole === 'admin' && targetRole !== 'staff') {
      return res.status(403).json({ error: 'Admins are only authorized to edit Staff accounts.' });
    }

    const newRole = role ? normalizeRole(role) : targetRole;
    if (currentUserRole === 'admin' && newRole !== 'staff') {
      return res.status(403).json({ error: 'Admins cannot escalate privileges above Staff.' });
    }

    const newUsername = (username || targetUser.username).trim();
    const newEmail = (email || targetUser.email).trim();
    const newFullName = (fullName || targetUser.full_name).trim();

    let newHash = targetUser.password_hash;
    let newStoredPassword = targetUser.stored_password;

    if (password && password.trim().length > 0) {
      newHash = await hashPassword(password);
      newStoredPassword = password;
    }

    await query(
      'UPDATE users SET username = ?, email = ?, password_hash = ?, stored_password = ?, role = ?, full_name = ? WHERE id = ?',
      [newUsername, newEmail, newHash, newStoredPassword, newRole, newFullName, id]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'users', id, {
      username: newUsername,
      role: newRole,
      passwordChanged: Boolean(password),
    });

    return res.json({
      message: 'User account updated successfully.',
      user: {
        id,
        username: newUsername,
        name: newFullName,
        email: newEmail,
        role: newRole,
        fullName: newFullName,
        password: newStoredPassword,
        stored_password: newStoredPassword,
      },
    });
  } catch (err) {
    logger.error('Update user error:', err, 'AUTH');
    return res.status(500).json({ error: 'Failed to update user.' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const currentUserRole = normalizeRole(req.user?.role);

    if (String(req.user.id) === String(id)) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const existing = await query('SELECT id, username, role FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (currentUserRole === 'admin' && normalizeRole(existing[0].role) !== 'staff') {
      return res.status(403).json({ error: 'Admins can only delete Staff accounts.' });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    await recordAudit(req.user.username, 'DELETE', 'users', id, { targetId: id, username: existing[0].username });

    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    logger.error('Delete user error:', err, 'AUTH');
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  login,
  getMe,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};

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
        console.error('Password hash upgrade error:', err.message);
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
    console.error('Login error:', err);
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
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function listUsers(req, res) {
  try {
    const users = await query('SELECT id, username, email, role, full_name, created_at FROM users ORDER BY id ASC');
    return res.json({
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: normalizeRole(u.role),
        displayRole: u.role,
        fullName: u.full_name,
        createdAt: u.created_at,
      })),
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, role, fullName } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A user with that username or email already exists.' });
    }

    const argonHash = await hashPassword(password);
    const result = await query(
      'INSERT INTO users (username, email, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)',
      [username.trim(), email.trim(), argonHash, role.trim(), (fullName || username).trim()]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'users', result.insertId, {
      username,
      role,
    });

    return res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      user: {
        id: result.insertId,
        username,
        email,
        role: normalizeRole(role),
        displayRole: role,
        fullName: fullName || username,
      },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (String(req.user.id) === String(id)) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    await recordAudit(req.user.username, 'DELETE', 'users', id, { targetId: id });

    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  login,
  getMe,
  listUsers,
  createUser,
  deleteUser,
};

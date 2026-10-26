const { verifyToken } = require('../utils/security');
const { query } = require('../config/db');

function normalizeRole(role) {
  if (!role) return '';
  const r = role.toLowerCase().replace(/[\s_-]+/g, '');
  if (r.includes('super')) return 'superadmin';
  if (r.includes('admin')) return 'admin';
  if (r.includes('staff') || r.includes('editor')) return 'staff';
  return r;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  req.user = {
    ...decoded,
    normalizedRole: normalizeRole(decoded.role),
  };
  next();
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = {
        ...decoded,
        normalizedRole: normalizeRole(decoded.role),
      };
    }
  }
  next();
}

function requireRole(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userRole = req.user.normalizedRole;

    // Superadmin has access to everything
    if (userRole === 'superadmin') {
      return next();
    }

    if (normalizedAllowed.includes(userRole)) {
      return next();
    }

    // Never enumerate the permitted roles in the response. Doing so would
    // reveal restricted roles (including superadmin) to staff accounts.
    return res.status(403).json({
      error: 'Access denied. Your account does not have permission to perform this action.',
    });
  };
}

async function recordAudit(userName, action, entityType, entityId, details) {
  try {
    const detailsJson = typeof details === 'object' ? JSON.stringify(details) : JSON.stringify({ note: details });
    await query(
      'INSERT INTO audit_logs (user_name, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userName || 'System', action, entityType, String(entityId || ''), detailsJson]
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  normalizeRole,
  recordAudit,
};

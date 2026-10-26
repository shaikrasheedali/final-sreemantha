const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { normalizeRole } = require('../middleware/auth');
const { mentionsSuperAdmin, superadminBlindSqlFilter } = require('../utils/stealth');

async function getAuditLogs(req, res) {
  try {
    const requestedLimit = Number.parseInt(String(req.query.limit || '50'), 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(500, Math.max(1, requestedLimit))
      : 50;

    const currentUserRole = normalizeRole(req.user?.role);
    let sql =
      'SELECT id, user_name, action, entity_type, entity_id, details, created_at FROM audit_logs';

    // Administrator and staff views must remain completely blind to the
    // superadmin identity. Only a superadmin can read the unfiltered trail.
    if (currentUserRole !== 'superadmin') {
      const blindColumns = ['user_name', 'action', 'entity_type', 'details'];
      sql += ' WHERE ' + blindColumns.map(superadminBlindSqlFilter).join(' AND ');
    }

    sql += ' ORDER BY id DESC LIMIT ?';
    const items = await query(sql, [limit]);

    // Repeat the check in JavaScript so legacy encodings that the SQL
    // normalisation does not cover still cannot reach an administrator.
    const visibleItems =
      currentUserRole === 'superadmin'
        ? items
        : items.filter((item) => !mentionsSuperAdmin(item));

    return res.json({ auditLogs: visibleItems });
  } catch (err) {
    logger.error('Get audit logs error:', err, 'AUDIT');
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
}

module.exports = {
  getAuditLogs,
};

const { logger } = require('../utils/logger');
const { query } = require('../config/db');

async function getAuditLogs(req, res) {
  try {
    const { limit = 50 } = req.query;
    const items = await query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?', [Number(limit)]);
    return res.json({ auditLogs: items });
  } catch (err) {
    logger.error('Get audit logs error:', err, 'AUDIT');
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
}

module.exports = {
  getAuditLogs,
};

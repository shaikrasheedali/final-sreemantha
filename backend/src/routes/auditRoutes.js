const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, requireRole('superadmin', 'admin'), getAuditLogs);

module.exports = router;

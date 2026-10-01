const express = require('express');
const { getSettings, updateSetting, updateSettings } = require('../controllers/settingsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireRole('superadmin', 'admin'), updateSettings);
router.put('/:key', authenticateToken, requireRole('superadmin', 'admin'), updateSetting);

module.exports = router;

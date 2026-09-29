const express = require('express');
const { getSettings, updateSetting } = require('../controllers/settingsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSettings);
router.put('/:key', authenticateToken, requireRole('superadmin', 'admin'), updateSetting);

module.exports = router;

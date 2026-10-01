const express = require('express');
const { upload, handleUpload, getAllMedia, deleteMedia } = require('../controllers/mediaController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAllMedia);
router.post('/upload', authenticateToken, upload.single('file'), handleUpload);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteMedia);

module.exports = router;

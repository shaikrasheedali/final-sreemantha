const express = require('express');
const { upload, handleUpload } = require('../controllers/mediaController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), handleUpload);

module.exports = router;

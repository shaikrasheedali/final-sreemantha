const express = require('express');
const {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllGallery);
router.get('/:id', getGalleryById);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createGalleryItem);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateGalleryItem);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteGalleryItem);

module.exports = router;

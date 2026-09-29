const express = require('express');
const {
  getAllSpecialties,
  getSpecialtyBySlug,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} = require('../controllers/specialtiesController');
const { optionalAuth, authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllSpecialties);
router.get('/:slug', optionalAuth, getSpecialtyBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createSpecialty);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateSpecialty);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteSpecialty);

module.exports = router;

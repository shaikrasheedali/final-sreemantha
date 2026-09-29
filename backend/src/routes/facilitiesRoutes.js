const express = require('express');
const {
  getAllFacilities,
  getFacilityBySlug,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../controllers/facilitiesController');
const { optionalAuth, authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllFacilities);
router.get('/:slug', optionalAuth, getFacilityBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createFacility);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateFacility);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteFacility);

module.exports = router;

const express = require('express');
const {
  getAllTreatments,
  getTreatmentBySlug,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} = require('../controllers/treatmentsController');
const { optionalAuth, authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllTreatments);
router.get('/:slug', optionalAuth, getTreatmentBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createTreatment);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateTreatment);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteTreatment);

module.exports = router;

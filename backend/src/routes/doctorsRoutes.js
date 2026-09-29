const express = require('express');
const {
  getAllDoctors,
  getDoctorBySlug,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorsController');
const { optionalAuth, authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllDoctors);
router.get('/:slug', optionalAuth, getDoctorBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createDoctor);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateDoctor);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteDoctor);

module.exports = router;

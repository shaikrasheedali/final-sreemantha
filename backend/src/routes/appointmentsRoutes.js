const express = require('express');
const {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), getAllAppointments);
router.post('/', createAppointment);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateAppointment);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteAppointment);

module.exports = router;

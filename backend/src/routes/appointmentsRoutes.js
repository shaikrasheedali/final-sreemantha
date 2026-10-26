const express = require('express');
const {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const publicBookingLimiter = createRateLimiter({
  name: 'appointment-booking',
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many appointment requests. Please call the hospital directly or try again later.',
});

router.get('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), getAllAppointments);
router.post('/', publicBookingLimiter, createAppointment);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateAppointment);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteAppointment);

module.exports = router;

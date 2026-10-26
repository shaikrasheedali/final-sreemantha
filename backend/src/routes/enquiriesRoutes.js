const express = require('express');
const {
  getAllEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  convertToAppointment,
} = require('../controllers/enquiriesController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const publicEnquiryLimiter = createRateLimiter({
  name: 'enquiry-submission',
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many enquiry submissions. Please call the hospital directly or try again later.',
});

router.get('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), getAllEnquiries);
router.post('/', publicEnquiryLimiter, createEnquiry);
router.post('/:id/convert-to-appointment', authenticateToken, requireRole('superadmin', 'admin', 'staff'), convertToAppointment);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateEnquiry);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteEnquiry);

module.exports = router;

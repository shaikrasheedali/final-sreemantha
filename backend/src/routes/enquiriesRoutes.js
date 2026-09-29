const express = require('express');
const {
  getAllEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiriesController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), getAllEnquiries);
router.post('/', createEnquiry);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateEnquiry);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteEnquiry);

module.exports = router;

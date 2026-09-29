const express = require('express');
const {
  getAllInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance,
} = require('../controllers/insuranceController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllInsurance);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createInsurance);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateInsurance);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteInsurance);

module.exports = router;

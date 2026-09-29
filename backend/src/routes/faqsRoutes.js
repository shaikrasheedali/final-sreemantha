const express = require('express');
const {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllFaqs);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createFaq);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateFaq);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteFaq);

module.exports = router;

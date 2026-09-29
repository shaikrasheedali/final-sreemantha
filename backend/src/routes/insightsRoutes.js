const express = require('express');
const {
  getAllInsights,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
} = require('../controllers/insightsController');
const { optionalAuth, authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllInsights);
router.get('/:slug', optionalAuth, getInsightBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createInsight);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateInsight);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteInsight);

module.exports = router;

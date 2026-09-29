const express = require('express');
const {
  getAllDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:slug', getDepartmentBySlug);
router.post('/', authenticateToken, requireRole('superadmin', 'admin', 'staff'), createDepartment);
router.put('/:id', authenticateToken, requireRole('superadmin', 'admin', 'staff'), updateDepartment);
router.delete('/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteDepartment);

module.exports = router;

const express = require('express');
const { login, getMe, listUsers, createUser, updateUser, deleteUser } = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, requireRole('superadmin', 'admin'), listUsers);
router.post('/users', authenticateToken, requireRole('superadmin', 'admin'), createUser);
router.put('/users/:id', authenticateToken, requireRole('superadmin', 'admin'), updateUser);
router.delete('/users/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteUser);

module.exports = router;

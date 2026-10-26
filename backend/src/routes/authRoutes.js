const express = require('express');
const { login, getMe, listUsers, createUser, updateUser, deleteUser } = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Protect the credential endpoint from brute-force and credential-stuffing
// attempts. The IP-wide bucket also covers username enumeration, while the
// account bucket only counts failures so successful sign-ins are never
// penalised.
const loginIpLimiter = createRateLimiter({
  name: 'login-ip',
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many sign-in attempts from this network. Please try again later.',
});

const loginAccountLimiter = createRateLimiter({
  name: 'login-account',
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many failed sign-in attempts. Please try again later.',
  keyGenerator: (req) => {
    const identifier = String(req.body?.username || req.body?.email || '')
      .trim()
      .toLowerCase();
    return `${req.ip || req.socket?.remoteAddress || 'unknown'}:${identifier}`;
  },
});

router.post('/login', loginIpLimiter, loginAccountLimiter, login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, requireRole('superadmin', 'admin'), listUsers);
router.post('/users', authenticateToken, requireRole('superadmin', 'admin'), createUser);
router.put('/users/:id', authenticateToken, requireRole('superadmin', 'admin'), updateUser);
router.delete('/users/:id', authenticateToken, requireRole('superadmin', 'admin'), deleteUser);

module.exports = router;

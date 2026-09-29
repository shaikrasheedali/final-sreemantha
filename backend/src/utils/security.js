const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sreemantha-hospital-super-secure-jwt-secret-2026-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hash a plain text password using Argon2id
 */
async function hashPassword(plainPassword) {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verify a password against an Argon2 hash, with fallback for bcrypt legacy hashes
 */
async function verifyPassword(hash, plainPassword) {
  if (!hash || !plainPassword) return false;

  // Standard Argon2 hash check
  if (hash.startsWith('$argon2')) {
    try {
      return await argon2.verify(hash, plainPassword);
    } catch (err) {
      console.error('Argon2 verify error:', err.message);
      return false;
    }
  }

  // Fallback for bcrypt legacy hash ($2a$, $2b$, $2y$)
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    try {
      let bcrypt;
      try {
        bcrypt = require('bcryptjs');
      } catch (e) {
        bcrypt = null;
      }
      if (bcrypt) {
        return await bcrypt.compare(plainPassword, hash);
      }
    } catch (err) {
      console.error('Bcrypt fallback verify error:', err.message);
    }
  }

  return false;
}

/**
 * Generate a JWT token for an authenticated user
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.full_name || user.name || user.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  JWT_SECRET,
};

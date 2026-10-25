const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('../config/env');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Resolve the JWT signing secret.
 *
 * Priority:
 *  1. JWT_SECRET from the hosting dashboard / process environment.
 *  2. A generated secret persisted under backend/data/.jwt-secret.
 *  3. A random in-memory secret (sessions survive only until restart).
 *
 * There is deliberately no hard-coded fallback: a public repository must never
 * ship a signing key that anyone could use to forge administrator tokens.
 */
function resolveJwtSecret() {
  const envSecret = (process.env.JWT_SECRET || '').trim();
  if (envSecret) {
    return { secret: envSecret, source: 'environment' };
  }

  const secretFile = path.resolve(
    process.env.JWT_SECRET_FILE || path.join(__dirname, '../../data/.jwt-secret')
  );

  try {
    if (fs.existsSync(secretFile)) {
      const existing = fs.readFileSync(secretFile, 'utf8').trim();
      if (existing.length >= 32) {
        return { secret: existing, source: 'file' };
      }
    }
  } catch (err) {
    console.warn(`[Security] Could not read JWT secret file: ${err.message}`);
  }

  const generated = crypto.randomBytes(48).toString('hex');

  try {
    fs.mkdirSync(path.dirname(secretFile), { recursive: true });
    fs.writeFileSync(secretFile, `${generated}\n`, { mode: 0o600 });
    return { secret: generated, source: 'generated-file' };
  } catch (err) {
    console.warn(`[Security] Could not persist JWT secret file: ${err.message}`);
    return { secret: generated, source: 'ephemeral' };
  }
}

const { secret: JWT_SECRET, source: JWT_SECRET_SOURCE } = resolveJwtSecret();

if (JWT_SECRET_SOURCE !== 'environment') {
  console.warn(
    '[Security] JWT_SECRET is not configured. A generated secret is in use ' +
      `(${JWT_SECRET_SOURCE}). Set JWT_SECRET in the hosting secrets for stable, portable sessions.`
  );
}

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
  JWT_SECRET_SOURCE,
};

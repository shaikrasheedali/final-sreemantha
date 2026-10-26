/**
 * Small dependency-free rate limiter for the public API.
 *
 * GoDaddy runs the application as a single Node process, so an in-memory
 * fixed-window counter is sufficient to blunt credential stuffing and form
 * spam without adding another runtime dependency. Buckets are swept lazily so
 * long-lived processes do not accumulate stale keys.
 */

const buckets = new Map();
let lastSweep = 0;

function clientAddress(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function sweepExpired(now) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function rateLimitedResponse(req, res, bucket, message) {
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - Date.now()) / 1000));
  res.setHeader('Retry-After', String(retryAfter));
  return res.status(429).json({
    success: false,
    error: message,
    statusCode: 429,
    code: 'RATE_LIMITED',
    requestId: req.id || 'unknown',
    retryAfter,
    timestamp: new Date().toISOString(),
  });
}

/**
 * @param {object} options
 * @param {string} options.name Unique bucket namespace.
 * @param {number} options.windowMs Window length in milliseconds.
 * @param {number} options.max Maximum attempts inside the window.
 * @param {string} options.message Client-facing message.
 * @param {(req: import('express').Request) => string} [options.keyGenerator]
 *   Extra key material (for example the submitted username).
 * @param {boolean} [options.skipSuccessfulRequests] Count only failed
 *   responses (status >= 400). Useful for login attempts.
 */
function createRateLimiter({
  name,
  windowMs,
  max,
  message = 'Too many requests. Please try again later.',
  keyGenerator,
  skipSuccessfulRequests = false,
}) {
  return function rateLimiter(req, res, next) {
    const now = Date.now();
    sweepExpired(now);

    const identity = keyGenerator ? keyGenerator(req) : clientAddress(req);
    const key = `${name}:${identity}`;

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    if (bucket.count >= max) {
      return rateLimitedResponse(req, res, bucket, message);
    }

    bucket.count += 1;

    if (skipSuccessfulRequests) {
      res.on('finish', () => {
        if (res.statusCode >= 400) return;

        const current = buckets.get(key);
        if (!current) return;
        current.count = Math.max(0, current.count - 1);
        if (current.count === 0) buckets.delete(key);
      });
    }

    return next();
  };
}

module.exports = { createRateLimiter };

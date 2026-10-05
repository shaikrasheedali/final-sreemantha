/**
 * Centralized Enterprise Error Handling Middleware
 * Sreemantha Hospital Platform & Clinical CMS
 * Handles errors gracefully without altering application logic or breaking response contracts.
 */

const { logger } = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function notFoundHandler(req, res, next) {
  // Only handle API 404s; let SPA fallback handle static/client routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `API route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
      requestId: req.id || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

function errorHandler(err, req, res, next) {
  const reqId = req.id || req.headers['x-request-id'] || 'req-unknown';
  let statusCode = err.status || err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected internal server error occurred.';
  let details = err.details || null;

  // 1. MySQL Specific Error Handling
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'A record with the specified unique identifier or slug already exists.';
    details = { sqlMessage: err.sqlMessage };
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    code = 'FOREIGN_KEY_VIOLATION';
    message = 'Operation violates database relational integrity.';
  } else if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    code = 'DATABASE_UNAVAILABLE';
    message = 'Database service is temporarily unavailable. Please retry shortly.';
  }

  // 2. JWT / Authentication Specific Handling
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token provided.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please log in again.';
  }

  // 3. Multer / File Upload Handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    code = 'FILE_TOO_LARGE';
    message = 'Uploaded file exceeds the maximum allowed size limit.';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    code = 'UNEXPECTED_FILE_FIELD';
    message = 'Unexpected file field encountered during upload.';
  }

  // Log error using centralized logger
  const logContext = req.path ? `API ${req.method} ${req.path}` : 'GLOBAL_ERROR';
  if (statusCode >= 500) {
    logger.error(`[${reqId}] ${message}`, err, logContext);
  } else {
    logger.warn(`[${reqId}] ${message} (${code})`, { statusCode, details }, logContext);
  }

  // Clean, consistent JSON response preserving backwards compatibility
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    code,
    requestId: reqId,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { debugStack: err.stack.split('\n').slice(0, 3) } : {}),
  });
}

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};

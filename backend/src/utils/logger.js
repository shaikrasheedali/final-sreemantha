/**
 * Enterprise Centralized Logger
 * Sreemantha Hospital Platform & Clinical CMS
 * Provides structured, colorized, readable, and debuggable logging with request correlation.
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const LEVEL_COLORS = {
  error: '\x1b[31m\x1b[1m', // Bold Red
  warn: '\x1b[33m\x1b[1m',  // Bold Yellow
  info: '\x1b[36m\x1b[1m',  // Bold Cyan
  http: '\x1b[35m',         // Magenta
  debug: '\x1b[90m',        // Gray
};

const RESET_COLOR = '\x1b[0m';
const DIM_COLOR = '\x1b[2m';
const BOLD_COLOR = '\x1b[1m';
const GREEN_COLOR = '\x1b[32m';

const CURRENT_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const pad3 = (n) => String(n).padStart(3, '0');
  const d = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad3(now.getMilliseconds())}`;
  return `${d} ${t}`;
}

function shouldLog(level) {
  const currentThreshold = LOG_LEVELS[CURRENT_LEVEL] !== undefined ? LOG_LEVELS[CURRENT_LEVEL] : LOG_LEVELS.info;
  const levelPriority = LOG_LEVELS[level] !== undefined ? LOG_LEVELS[level] : LOG_LEVELS.info;
  return levelPriority <= currentThreshold;
}

function formatMetadata(meta) {
  if (!meta || Object.keys(meta).length === 0) return '';
  try {
    return ' ' + DIM_COLOR + JSON.stringify(meta, (key, value) => {
      if (key === 'password' || key === 'token' || key === 'authorization' || key === 'secret') {
        return '[REDACTED]';
      }
      if (value instanceof Error) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack ? value.stack.split('\n').slice(0, 4).map(s => s.trim()) : undefined,
        };
      }
      return value;
    }) + RESET_COLOR;
  } catch (err) {
    return ' [Meta serialization failed]';
  }
}

class Logger {
  constructor(defaultContext = 'APP') {
    this.defaultContext = defaultContext;
  }

  child(context) {
    return new Logger(typeof context === 'string' ? context : (context.context || this.defaultContext));
  }

  log(level, message, meta = {}, context = null) {
    if (!shouldLog(level)) return;

    const ctx = context || this.defaultContext;
    const timestamp = getTimestamp();
    const color = LEVEL_COLORS[level] || RESET_COLOR;
    const badge = `${color}[${level.toUpperCase()}]${RESET_COLOR}`;
    const ctxBadge = `${BOLD_COLOR}[${ctx}]${RESET_COLOR}`;

    let msgStr = message;
    let errorStack = '';

    if (message instanceof Error) {
      msgStr = message.message;
      errorStack = message.stack ? `\n${DIM_COLOR}${message.stack}${RESET_COLOR}` : '';
    } else if (meta instanceof Error) {
      errorStack = meta.stack ? `\n${DIM_COLOR}${meta.stack}${RESET_COLOR}` : '';
      meta = { error: meta.message, name: meta.name };
    } else if (meta && meta.error instanceof Error) {
      errorStack = meta.error.stack ? `\n${DIM_COLOR}${meta.error.stack}${RESET_COLOR}` : '';
      meta = { ...meta, error: meta.error.message };
    }

    const metaStr = formatMetadata(meta);
    const line = `${DIM_COLOR}${timestamp}${RESET_COLOR} ${badge} ${ctxBadge} ${msgStr}${metaStr}${errorStack}`;

    if (level === 'error') {
      console.error(line);
    } else if (level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  }

  info(message, meta, context) {
    this.log('info', message, meta, context);
  }

  warn(message, meta, context) {
    this.log('warn', message, meta, context);
  }

  error(message, errorOrMeta, context) {
    this.log('error', message, errorOrMeta, context);
  }

  debug(message, meta, context) {
    this.log('debug', message, meta, context);
  }

  http(message, meta, context) {
    this.log('http', message, meta, context || 'HTTP');
  }
}

const defaultLogger = new Logger('SYSTEM');

// Express Request ID & HTTP Request Logger Middleware
function requestCorrelationMiddleware(req, res, next) {
  const reqId = req.headers['x-request-id'] || `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  req.id = reqId;
  res.setHeader('x-request-id', reqId);

  const startTime = Date.now();
  req.logger = defaultLogger.child(reqId);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    let statusColor = GREEN_COLOR;
    if (status >= 500) statusColor = LEVEL_COLORS.error;
    else if (status >= 400) statusColor = LEVEL_COLORS.warn;
    else if (status >= 300) statusColor = LEVEL_COLORS.info;

    const method = req.method;
    const url = req.originalUrl || req.url;

    // Filter out noisier static assets or polling if desired, but log all API calls
    if (url.startsWith('/api') || url === '/') {
      defaultLogger.http(
        `${method} ${url} ${statusColor}${status}${RESET_COLOR} - ${duration}ms`,
        {
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
          userAgent: req.headers['user-agent'] ? req.headers['user-agent'].slice(0, 60) : undefined,
          requestId: reqId,
        }
      );
    }
  });

  next();
}

module.exports = {
  logger: defaultLogger,
  Logger,
  requestCorrelationMiddleware,
};

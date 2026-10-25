require('./config/env');
const app = require('./app');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./config/migrate');
const { logger } = require('./utils/logger');

const configuredPort = Number(process.env.PORT);
const PORT = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 5000;
const HOST = process.env.HOST || '0.0.0.0';

let server = null;
let shuttingDown = false;

async function initializeDatabase() {
  logger.info('Connecting to database...', {}, 'DATABASE');
  const dbStatus = await testConnection();

  if (!dbStatus.ok) {
    logger.warn(
      `Database connection issue: ${dbStatus.error}. The server will start in degraded mode; /api/health will report the problem.`,
      {},
      'DATABASE'
    );
    return false;
  }

  logger.info('Connected to MySQL database successfully.', {}, 'DATABASE');

  try {
    await runMigrations();
    return true;
  } catch (err) {
    // A migration/content problem must not prevent the HTTP server from
    // binding to PORT; otherwise the hosting platform reports a failed start.
    logger.error(
      'Database initialization failed. Starting in degraded mode so the site and health endpoint remain reachable.',
      err,
      'DATABASE'
    );
    return false;
  }
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`Received ${signal}; shutting down gracefully...`, {}, 'SERVER');

  const forceExit = setTimeout(() => {
    logger.warn('Graceful shutdown timed out; forcing exit.', {}, 'SERVER');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  if (!server) {
    clearTimeout(forceExit);
    process.exit(0);
    return;
  }

  server.close(() => {
    clearTimeout(forceExit);
    logger.info('HTTP server closed.', {}, 'SERVER');
    process.exit(0);
  });
}

async function startServer() {
  try {
    await initializeDatabase();
  } catch (err) {
    logger.error('Unexpected database initialization error:', err, 'DATABASE');
  }

  server = app.listen(PORT, HOST, () => {
    logger.info('====================================================', {}, 'STARTUP');
    logger.info(`Sreemantha Hospital Platform Server running on port ${PORT}`, {}, 'STARTUP');
    logger.info(`Health Check: http://localhost:${PORT}/api/health`, {}, 'STARTUP');
    logger.info(`API Documentation: http://localhost:${PORT}/api/docs`, {}, 'STARTUP');
    logger.info(`Public Website / SPA: http://localhost:${PORT}/`, {}, 'STARTUP');
    logger.info('====================================================', {}, 'STARTUP');
  });

  // Keep long-lived connections healthy behind the hosting proxy.
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use.`, err, 'SERVER');
    } else {
      logger.error('HTTP server error:', err, 'SERVER');
    }
    process.exit(1);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason, 'PROCESS');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception; exiting to avoid an inconsistent process:', err, 'PROCESS');
  process.exit(1);
});

startServer();

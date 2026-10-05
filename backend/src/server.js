require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./config/migrate');
const { seedInitialUsers } = require('./config/seed');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    logger.info('Connecting to database...', {}, 'DATABASE');
    const dbStatus = await testConnection();

    if (dbStatus.ok) {
      logger.info('Connected to MySQL database successfully.', {}, 'DATABASE');
      await runMigrations();
      await seedInitialUsers();
    } else {
      logger.warn(`Database connection issue: ${dbStatus.error}`, {}, 'DATABASE');
    }

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`====================================================`, {}, 'STARTUP');
      logger.info(`🚀 Sreemantha Hospital Platform Server running on port ${PORT}`, {}, 'STARTUP');
      logger.info(`🏥 Health Check: http://localhost:${PORT}/api/health`, {}, 'STARTUP');
      logger.info(`📖 API Documentation: http://localhost:${PORT}/api/docs`, {}, 'STARTUP');
      logger.info(`🌐 Public Website / SPA: http://localhost:${PORT}/`, {}, 'STARTUP');
      logger.info(`====================================================`, {}, 'STARTUP');
    });
  } catch (err) {
    logger.error('Fatal startup error:', err, 'SERVER');
    process.exit(1);
  }
}

startServer();


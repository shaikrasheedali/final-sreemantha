require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./config/migrate');
const { seedInitialUsers } = require('./config/seed');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('[Server] Connecting to database...');
    const dbStatus = await testConnection();

    if (dbStatus.ok) {
      console.log('[Server] Connected to MySQL database successfully.');
      await runMigrations();
      await seedInitialUsers();
    } else {
      console.warn('[Server] Database connection issue:', dbStatus.error);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`🚀 Sreemantha Hospital Platform Server running on port ${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🌐 Public Website / SPA: http://localhost:${PORT}/`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();

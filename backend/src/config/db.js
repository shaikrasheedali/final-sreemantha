require('./env');
const mysql = require('mysql2/promise');

/**
 * GoDaddy Hosted MySQL Database Integration
 *
 * DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD are injected
 * automatically when the hosted database is attached to the app.
 *
 * Connection behaviour:
 * - Short-lived connection per request (recommended by the platform).
 * - Every caller closes its own connection in a finally block.
 * - Explicit connect timeout so a database outage cannot hang a health check.
 */
function formatDbError(err) {
  if (!err) return 'Unknown database error';
  if (err.message && String(err.message).trim()) return err.message;
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors.map((inner) => inner.message || inner.code).filter(Boolean).join('; ');
  }
  if (err.code) return String(err.code);
  return String(err);
}

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getDbConfig() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: positiveInteger(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sreemantha_db',
    charset: 'utf8mb4',
    connectTimeout: positiveInteger(process.env.DB_CONNECT_TIMEOUT_MS, 10000),
  };

  // GoDaddy managed MySQL normally does not require SSL. Set DB_SSL=true only
  // when the database endpoint requires it.
  if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
    config.ssl = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };
  }

  return config;
}

/**
 * Creates a short-lived connection to the GoDaddy MySQL database.
 */
async function createConnection() {
  return mysql.createConnection(getDbConfig());
}

/**
 * Executes a query with a short-lived connection and always closes it.
 */
async function query(sql, params) {
  const connection = await createConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    await connection.end().catch(() => {});
  }
}

/**
 * Executes a callback with a dedicated connection and always closes it.
 * Useful for multi-statement bootstrap work.
 */
async function withConnection(callback) {
  const connection = await createConnection();
  try {
    return await callback(connection);
  } finally {
    await connection.end().catch(() => {});
  }
}

/**
 * Verifies database connectivity during server boot and health probes.
 */
async function testConnection() {
  let connection;
  try {
    connection = await createConnection();
    const [rows] = await connection.query('SELECT 1 as test');
    return { ok: true, rows };
  } catch (err) {
    const message = formatDbError(err);
    console.error('MySQL connection error:', message);
    return { ok: false, error: message, code: err.code || null };
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeErr) {
        // ignore close error
      }
    }
  }
}

// Backward-compatible pool shim for legacy references or teardown hooks
const pool = {
  query: (sql, params) => query(sql, params),
  execute: (sql, params) => query(sql, params),
  getConnection: () => createConnection(),
  end: async () => {},
};

module.exports = {
  createConnection,
  getConnection: createConnection,
  getDbConfig,
  formatDbError,
  query,
  testConnection,
  withConnection,
  pool,
};

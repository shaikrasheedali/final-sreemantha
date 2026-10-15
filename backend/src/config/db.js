const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * GoDaddy Hosted MySQL Database Integration
 *
 * Environment variables:
 * When a hosted database is attached, DB_HOST, DB_PORT, DB_NAME, DB_USER,
 * and DB_PASSWORD are set automatically in process.env.
 */
function getDbConfig() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sreemantha_db',
  };

  // Enable SSL if required by database provider or hosting policy
  if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

/**
 * Creates a short-lived connection to the GoDaddy MySQL database.
 */
async function createConnection() {
  return await mysql.createConnection(getDbConfig());
}

/**
 * Executes a query with a short-lived connection per request,
 * and always closes the connection in a finally block.
 */
async function query(sql, params) {
  const connection = await createConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    await connection.end();
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
    console.error('MySQL connection error:', err.message);
    return { ok: false, error: err.message };
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
  query,
  testConnection,
  pool,
};

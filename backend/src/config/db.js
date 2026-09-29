const mysql = require('mysql2/promise');
require('dotenv').config();

const DEFAULT_DB_URL = 'mysql://avnadmin:AVNS_UwfqWlxt0O34MnQHGRl@sreemantha-sreemantha.d.aivencloud.com:21483/defaultdb';

const dbUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;
// Remove any query params like ?ssl-mode=REQUIRED for mysql2 parsing, configure ssl object directly
const cleanUrl = dbUrl.split('?')[0];

const pool = mysql.createPool({
  uri: cleanUrl,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

async function query(sql, params) {
  const [results] = await pool.query(sql, params);
  return results;
}

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    return { ok: true, rows };
  } catch (err) {
    console.error('MySQL connection error:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};

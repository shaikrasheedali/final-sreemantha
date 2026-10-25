/**
 * Centralised environment loading.
 *
 * GoDaddy injects DB_* (and any secrets configured in the dashboard) directly
 * into process.env. For local development we also support the conventional
 * .env files:
 *
 *   backend/.env   -> backend-specific overrides (wins)
 *   .env           -> project-root overrides
 *
 * Values already present in process.env (the hosting platform) always win.
 */
const path = require('path');
const dotenv = require('dotenv');

const envFiles = [
  path.resolve(__dirname, '../../.env'), // backend/.env
  path.resolve(__dirname, '../../../.env'), // project root .env
];

for (const envPath of envFiles) {
  dotenv.config({ path: envPath, override: false, quiet: true });
}

module.exports = {
  envFiles,
};

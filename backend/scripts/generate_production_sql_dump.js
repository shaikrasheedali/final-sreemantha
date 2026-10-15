const fs = require('fs');
const path = require('path');

const dump = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_dump.json'), 'utf-8'));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/config/baseline_data.json'), 'utf-8'));

function escapeSqlValue(colName, val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  let s = String(val);
  if (s.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    if (colName.includes('date') && !colName.includes('time') && !colName.includes('created') && !colName.includes('updated')) {
      s = s.slice(0, 10);
    } else {
      s = s.slice(0, 19).replace('T', ' ');
    }
  }
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

let sql = `-- ========================================================
-- Sreemantha Hospital Platform - Production MySQL Database Export
-- Clean Database with Local Codebase Assets Only (Zero External URLs)
-- Ready for GoDaddy Hosted MySQL Database Integration
-- Generated at: ${new Date().toISOString()}
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

`;

// Process all 16 tables in order
const tableOrder = [
  'users',
  'departments',
  'specialties',
  'treatments',
  'doctors',
  'facilities',
  'blog_posts',
  'gallery_items',
  'insurance_providers',
  'settings',
  'faqs',
  'testimonials',
  'media_assets',
  'appointments',
  'enquiries',
  'audit_logs'
];

for (const tableName of tableOrder) {
  const data = dump[tableName];
  if (!data) continue;

  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table structure for table \`${tableName}\`\n`;
  sql += `-- --------------------------------------------------------\n\n`;

  let schema = data.schema.replace(/"/g, '`');
  sql += `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n`;
  // Extract columns from CREATE TABLE body
  const innerSchema = schema.replace(/^CREATE TABLE `[^`]+` \(/i, '').replace(/\)[^)]*$/, '');
  sql += innerSchema + '\n);\n\n';

  // Seed rows from baseline data or users
  const rows = (tableName === 'users' ? dump['users'].rows : baseline[tableName]) || [];

  if (rows && rows.length > 0) {
    sql += `-- Dumping baseline data for table \`${tableName}\` (${rows.length} rows)\n\n`;
    
    const columns = Object.keys(rows[0]);
    const colList = columns.map(c => `\`${c}\``).join(', ');

    const chunkSize = 50;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const valuesList = chunk.map(row => {
        const vals = columns.map(c => escapeSqlValue(c, row[c]));
        return `(${vals.join(', ')})`;
      }).join(',\n  ');

      sql += `INSERT INTO \`${tableName}\` (${colList}) VALUES\n  ${valuesList};\n\n`;
    }
  }
}

sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
sql += `-- ========================================================\n`;
sql += `-- End of Database Export\n`;
sql += `-- ========================================================\n`;

const outPath = path.resolve(__dirname, '../database_godaddy_export.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`Successfully generated clean GoDaddy MySQL dump at: ${outPath} (${sql.length} characters)`);

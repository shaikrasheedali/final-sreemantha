const fs = require('fs');
const path = require('path');

const dump = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_dump.json'), 'utf-8'));

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    // JSON or Date
    if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
    return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  // String
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
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

for (const [tableName, data] of Object.entries(dump)) {
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table structure for table \`${tableName}\`\n`;
  sql += `-- --------------------------------------------------------\n\n`;

  // Normalize create table schema (convert any double quotes to backticks if needed)
  let schema = data.schema.replace(/"/g, '`');
  sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
  sql += `${schema};\n\n`;

  if (data.rows && data.rows.length > 0) {
    sql += `-- Dumping data for table \`${tableName}\` (${data.rows.length} rows)\n\n`;
    
    const columns = Object.keys(data.rows[0]);
    const colList = columns.map(c => `\`${c}\``).join(', ');

    // Write inserts in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < data.rows.length; i += chunkSize) {
      const chunk = data.rows.slice(i, i + chunkSize);
      const valuesList = chunk.map(row => {
        const vals = columns.map(c => escapeSqlValue(row[c]));
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
console.log(`Successfully generated GoDaddy MySQL dump at: ${outPath} (${sql.length} characters)`);

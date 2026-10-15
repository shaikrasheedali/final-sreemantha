const fs = require('fs');
const path = require('path');
const { createConnection } = require('../src/config/db');

async function inspect() {
  console.log('Connecting to configured database...');
  const conn = await createConnection();

  console.log('Successfully connected!');

  const [tables] = await conn.query('SHOW TABLES');
  console.log('Tables found:', tables.map(t => Object.values(t)[0]));

  const dump = {};

  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    const [createTable] = await conn.query(`SHOW CREATE TABLE \`${tableName}\``);
    const [count] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${tableName}\``);
    const [rows] = await conn.query(`SELECT * FROM \`${tableName}\``);
    
    dump[tableName] = {
      schema: createTable[0]['Create Table'],
      count: count[0].cnt,
      rows: rows
    };
    console.log(`Table ${tableName}: ${count[0].cnt} rows`);
  }

  const dumpPath = path.join(__dirname, 'db_dump.json');
  fs.writeFileSync(dumpPath, JSON.stringify(dump, null, 2), 'utf-8');
  console.log(`Dump written to ${dumpPath}`);

  await conn.end();
}

inspect().catch(err => {
  console.error('Inspect failed:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');

const dump = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_dump.json'), 'utf-8'));

console.log('--- Analyzing Database for URLs & Assets ---');

const urlFindings = [];

for (const [table, data] of Object.entries(dump)) {
  for (const row of data.rows) {
    for (const [col, val] of Object.entries(row)) {
      if (typeof val === 'string') {
        if (val.startsWith('http://') || val.startsWith('https://')) {
          urlFindings.push({ table, col, id: row.id || row._id || 'unknown', val });
        } else if (val.match(/\.(png|jpg|jpeg|webp|svg|gif|mp4|webm)/i)) {
          urlFindings.push({ table, col, id: row.id || row._id || 'unknown', val, isFileAsset: true });
        }
      }
    }
  }
}

console.log(`Found ${urlFindings.length} asset/URL references across database:`);
urlFindings.forEach(f => {
  console.log(`[${f.table}] row id ${f.id}, col ${f.col}: ${f.val}`);
});

const fs = require('fs');
const path = require('path');

const dump = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_dump.json'), 'utf-8'));

function sanitizeValue(key, val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') {
    // If it looks like an ISO date string: 2026-10-14T18:30:00.000Z
    if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      if (key.includes('date') && !key.includes('time') && !key.includes('created') && !key.includes('updated')) {
        // Pure date column
        return val.slice(0, 10);
      }
      // Datetime / timestamp column
      return val.slice(0, 19).replace('T', ' ');
    }
  }
  return val;
}

const baseline = {};

const contentTables = [
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
  'media_assets'
];

for (const tableName of contentTables) {
  if (dump[tableName] && dump[tableName].rows) {
    baseline[tableName] = dump[tableName].rows.map(row => {
      const sanitized = {};
      for (const [k, v] of Object.entries(row)) {
        sanitized[k] = sanitizeValue(k, v);
      }
      return sanitized;
    });
  }
}

const outPath = path.resolve(__dirname, '../src/config/baseline_data.json');
fs.writeFileSync(outPath, JSON.stringify(baseline, null, 2), 'utf-8');
console.log(`Generated sanitized baseline data at: ${outPath}`);

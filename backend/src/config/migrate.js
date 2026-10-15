const { initDatabase } = require('./initDb');

async function runMigrations() {
  await initDatabase();
}

module.exports = { runMigrations, initDatabaseIfEmpty: initDatabase };

if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

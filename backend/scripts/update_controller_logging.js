const fs = require('fs');
const path = require('path');

const controllersDir = path.resolve(__dirname, '../src/controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const moduleName = file.replace('Controller.js', '').toUpperCase();

  if (!content.includes("require('../utils/logger')")) {
    content = "const { logger } = require('../utils/logger');\n" + content;
  }

  // Replace console.error('...', err) with logger.error('...', err, 'MODULE')
  content = content.replace(/console\.error\(\s*(['"`].*?['"`])\s*,\s*([a-zA-Z0-9_.]+)\s*\);/g, (match, msg, errVar) => {
    return `logger.error(${msg}, ${errVar}, '${moduleName}');`;
  });

  // Also replace console.log
  content = content.replace(/console\.log\(\s*(['"`].*?['"`])\s*,\s*([a-zA-Z0-9_.]+)\s*\);/g, (match, msg, dataVar) => {
    return `logger.info(${msg}, ${dataVar}, '${moduleName}');`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed logging in:', file);
}

console.log('All controllers updated successfully.');

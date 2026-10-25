#!/usr/bin/env node
/**
 * Lightweight local check for the GoDaddy Node.js Hosting deploy contract.
 *
 * This mirrors the platform requirements that matter for this repository:
 * root package.json metadata, build/start/dev scripts, PORT binding, runtime
 * dependencies, managed MySQL usage, .npmrc, and upload hygiene.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}
function warn(message) {
  warnings.push(message);
}
function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (err) {
    fail(`Cannot read ${relativePath}: ${err.message}`);
    return null;
  }
}
function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}
function readText(relativePath) {
  try {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
  } catch {
    return '';
  }
}
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'test-results', 'coverage'].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|mjs|cjs|ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const pkg = readJson('package.json');
if (pkg) {
  if (!pkg.name || !String(pkg.name).trim()) fail('package.json is missing "name".');
  if (!pkg.version || !String(pkg.version).trim()) fail('package.json is missing "version".');
  if (!pkg.main) fail('package.json is missing "main".');
  else if (!exists(pkg.main)) fail(`package.json "main" file does not exist: ${pkg.main}`);
  if (!pkg.engines || !pkg.engines.node) {
    warn('package.json is missing engines.node (recommended: "20.x").');
  }

  for (const script of ['build', 'start', 'dev']) {
    if (!pkg.scripts || !String(pkg.scripts[script] || '').trim()) {
      fail(`package.json is missing a non-empty "${script}" script.`);
    }
  }

  const startScript = String(pkg.scripts?.start || '');
  const startEntry = startScript.match(/^node\s+([^\s]+)/);
  if (startEntry && !exists(startEntry[1])) {
    fail(`The start script points to a missing file: ${startEntry[1]}`);
  }

  const devScript = String(pkg.scripts?.dev || '');
  const devEntry = devScript.match(/^node\s+([^\s]+)/);
  if (devEntry && !exists(devEntry[1])) {
    fail(`The dev script points to a missing file: ${devEntry[1]}`);
  }

  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  for (const runtimePackage of ['express', 'mysql2']) {
    if (deps[runtimePackage] && !(pkg.dependencies || {})[runtimePackage]) {
      fail(`Runtime package "${runtimePackage}" is only in devDependencies.`);
    }
  }
  if (!(pkg.dependencies || {}).mysql2) {
    fail('mysql2 must be in root "dependencies" for the platform MySQL check.');
  }

  if (!pkg.workspaces || !pkg.workspaces.includes('backend') || !pkg.workspaces.includes('frontend')) {
    warn('Expected "workspaces": ["backend", "frontend"] so one production install covers the app.');
  }
}

if (!readText('.npmrc').includes('registry=https://registry.npmjs.org/')) {
  fail('.npmrc must contain registry=https://registry.npmjs.org/.');
}

if (exists('.env')) {
  warn('.env exists locally. It must not be uploaded to GoDaddy (it is gitignored).');
}
if (exists('node_modules')) {
  warn('node_modules exists locally. Exclude it from zip uploads; Git deployment already ignores it.');
}

const dbEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const sourceFiles = walk(root);
const allSource = sourceFiles.map((file) => readText(path.relative(root, file))).join('\n');

for (const name of dbEnvVars) {
  const pattern = new RegExp(`process\\.env\\.${name}\\b|process\\.env\\[\\s*['"]${name}['"]\\s*\\]`);
  if (!pattern.test(allSource)) {
    fail(`Managed MySQL requires a process.env.${name} reference.`);
  }
}
if (!/process\.env\.PORT\b/.test(allSource)) {
  fail('The server must read the listen port from process.env.PORT.');
}
if (/app\.listen\s*\(\s*['"]?\d{2,5}/.test(allSource)) {
  fail('Hard-coded app.listen(<port>) found; use process.env.PORT.');
}

const frontend = readJson('frontend/package.json');
if (frontend) {
  const frontendDeps = frontend.dependencies || {};
  for (const buildPackage of ['vite', 'typescript', '@vitejs/plugin-react']) {
    if (!frontendDeps[buildPackage]) {
      fail(`frontend "${buildPackage}" must be in dependencies because production install omits devDependencies.`);
    }
  }
}

const backend = readJson('backend/package.json');
if (backend) {
  for (const runtimePackage of ['express', 'mysql2', 'argon2', 'sharp']) {
    if (!(backend.dependencies || {})[runtimePackage]) {
      fail(`backend "${runtimePackage}" must be in dependencies.`);
    }
  }
  if ((backend.dependencies || {})['sreemantha-hospital-platform']) {
    fail('backend must not depend on the root package (self-referencing file:.. dependency).');
  }
}
if (frontend && (frontend.dependencies || {})['sreemantha-hospital-platform']) {
  fail('frontend must not depend on the root package (self-referencing file:.. dependency).');
}

if (!exists('frontend/dist/index.html')) {
  warn('frontend/dist is not built yet. Run "npm run build" before starting the production server.');
}

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARN:  ${message}`);

if (errors.length > 0) {
  console.error(`\nDeploy validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`\nDeploy validation passed${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);

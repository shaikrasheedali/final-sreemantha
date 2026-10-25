function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseJsonField(val, fallback = []) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    if (typeof val === 'string' && val.trim().length > 0) {
      return val;
    }
    return fallback;
  }
}

function stringifyJsonField(val, fallback = '[]') {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    // verify valid JSON or stringify
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify(val);
    }
  }
  return JSON.stringify(val);
}

/**
 * Serializes a mixed content field (rich HTML, plain text, or a structured
 * array/object) for a LONGTEXT column without double-encoding HTML.
 */
function stringifyContentField(val, fallback = '') {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

module.exports = {
  slugify,
  parseJsonField,
  stringifyJsonField,
  stringifyContentField,
};

/**
 * Helpers for keeping the superadmin identity out of administrative views.
 *
 * Role values and audit details are free-form database text, so comparisons
 * have to ignore spacing and punctuation ("Super Admin", "super_admin",
 * "super-admin") instead of relying on a single exact spelling.
 */

function normalizeIdentityText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function mentionsSuperAdmin(...values) {
  return values.some((value) => {
    if (value !== null && typeof value === 'object') {
      try {
        return normalizeIdentityText(JSON.stringify(value)).includes('superadmin');
      } catch {
        return false;
      }
    }
    return normalizeIdentityText(value).includes('superadmin');
  });
}

/**
 * SQL equivalent of mentionsSuperAdmin for a single trusted column name.
 * Intended for internal column references only, never user input.
 */
function superadminBlindSqlFilter(column) {
  return `REPLACE(REPLACE(REPLACE(REPLACE(LOWER(COALESCE(${column}, '')), ' ', ''), '_', ''), '-', ''), '.', '') NOT LIKE '%superadmin%'`;
}

module.exports = {
  normalizeIdentityText,
  mentionsSuperAdmin,
  superadminBlindSqlFilter,
};

const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { parseJsonField, stringifyJsonField } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getSettings(req, res) {
  try {
    const rows = await query('SELECT setting_key, setting_value, updated_at FROM settings');
    const settingsMap = {};

    for (const r of rows) {
      settingsMap[r.setting_key] = parseJsonField(r.setting_value, {});
    }

    return res.json({ settings: settingsMap });
  } catch (err) {
    logger.error('Get settings error:', err, 'SETTINGS');
    return res.status(500).json({ error: 'Failed to retrieve website settings.' });
  }
}

async function updateSetting(req, res) {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Setting key and value are required.' });
    }

    const valueStr = stringifyJsonField(value);
    const existing = await query('SELECT setting_key FROM settings WHERE setting_key = ?', [key]);

    if (existing.length === 0) {
      await query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, valueStr]);
    } else {
      await query('UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?', [valueStr, key]);
    }

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'settings', key, { setting_key: key });

    return res.json({ message: `Setting "${key}" updated successfully.`, key, value });
  } catch (err) {
    logger.error('Update setting error:', err, 'SETTINGS');
    return res.status(500).json({ error: 'Failed to update setting.' });
  }
}

async function updateSettings(req, res) {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Settings object is required.' });
    }

    for (const [key, value] of Object.entries(payload)) {
      const valueStr = stringifyJsonField(value);
      const existing = await query('SELECT setting_key FROM settings WHERE setting_key = ?', [key]);
      if (existing.length === 0) {
        await query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, valueStr]);
      } else {
        await query('UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?', [valueStr, key]);
      }
    }

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'settings', 'bulk', { keys: Object.keys(payload) });
    return res.json({ message: 'Settings updated successfully.', settings: payload });
  } catch (err) {
    logger.error('Update settings error:', err, 'SETTINGS');
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
}

module.exports = {
  getSettings,
  updateSetting,
  updateSettings,
};

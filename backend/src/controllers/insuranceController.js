const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { recordAudit } = require('../middleware/auth');

async function getAllInsurance(req, res) {
  try {
    const items = await query('SELECT * FROM insurance_providers WHERE status = \'active\' ORDER BY display_order ASC, id ASC');
    return res.json({ providers: items });
  } catch (err) {
    logger.error('Get insurance error:', err, 'INSURANCE');
    return res.status(500).json({ error: 'Failed to retrieve insurance providers.' });
  }
}

async function createInsurance(req, res) {
  try {
    const { name, type, cashless_available, claim_assistance_info, logo_url, display_order, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Provider name is required.' });

    const result = await query(
      'INSERT INTO insurance_providers (name, type, cashless_available, claim_assistance_info, logo_url, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, type || 'TPA & Insurer', cashless_available ? 1 : 0, claim_assistance_info || '', logo_url || '', display_order || 0, status || 'active']
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'insurance_providers', result.insertId, { name });
    return res.status(201).json({ message: 'Insurance provider added.', id: result.insertId });
  } catch (err) {
    logger.error('Create insurance error:', err, 'INSURANCE');
    return res.status(500).json({ error: 'Failed to create insurance provider.' });
  }
}

async function updateInsurance(req, res) {
  try {
    const { id } = req.params;
    const { name, type, cashless_available, claim_assistance_info, logo_url, display_order, status } = req.body;

    await query(
      'UPDATE insurance_providers SET name = ?, type = ?, cashless_available = ?, claim_assistance_info = ?, logo_url = ?, display_order = ?, status = ? WHERE id = ?',
      [name, type, cashless_available ? 1 : 0, claim_assistance_info, logo_url, display_order, status, id]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'insurance_providers', id, { name });
    return res.json({ message: 'Insurance provider updated.' });
  } catch (err) {
    logger.error('Update insurance error:', err, 'INSURANCE');
    return res.status(500).json({ error: 'Failed to update insurance provider.' });
  }
}

async function deleteInsurance(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM insurance_providers WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'insurance_providers', id, { id });
    return res.json({ message: 'Insurance provider deleted.' });
  } catch (err) {
    logger.error('Delete insurance error:', err, 'INSURANCE');
    return res.status(500).json({ error: 'Failed to delete insurance provider.' });
  }
}

module.exports = {
  getAllInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance,
};

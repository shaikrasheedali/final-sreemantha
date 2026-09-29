const { query } = require('../config/db');
const { recordAudit } = require('../middleware/auth');

async function getAllFaqs(req, res) {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM faqs WHERE status = \'published\'';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY display_order ASC, id ASC';
    const items = await query(sql, params);
    return res.json({ faqs: items });
  } catch (err) {
    console.error('Get FAQs error:', err);
    return res.status(500).json({ error: 'Failed to retrieve FAQs.' });
  }
}

async function createFaq(req, res) {
  try {
    const { category, question, answer, display_order, status } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required.' });

    const result = await query(
      'INSERT INTO faqs (category, question, answer, display_order, status) VALUES (?, ?, ?, ?, ?)',
      [category || 'General', question, answer, display_order || 0, status || 'published']
    );

    await recordAudit(req.user?.username || 'Staff', 'CREATE', 'faqs', result.insertId, { question });
    return res.status(201).json({ message: 'FAQ created.', id: result.insertId });
  } catch (err) {
    console.error('Create FAQ error:', err);
    return res.status(500).json({ error: 'Failed to create FAQ.' });
  }
}

async function updateFaq(req, res) {
  try {
    const { id } = req.params;
    const { category, question, answer, display_order, status } = req.body;

    await query(
      'UPDATE faqs SET category = ?, question = ?, answer = ?, display_order = ?, status = ? WHERE id = ?',
      [category, question, answer, display_order, status, id]
    );

    await recordAudit(req.user?.username || 'Staff', 'UPDATE', 'faqs', id, { question });
    return res.json({ message: 'FAQ updated.' });
  } catch (err) {
    console.error('Update FAQ error:', err);
    return res.status(500).json({ error: 'Failed to update FAQ.' });
  }
}

async function deleteFaq(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM faqs WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Staff', 'DELETE', 'faqs', id, { id });
    return res.json({ message: 'FAQ deleted.' });
  } catch (err) {
    console.error('Delete FAQ error:', err);
    return res.status(500).json({ error: 'Failed to delete FAQ.' });
  }
}

module.exports = {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};

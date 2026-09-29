const { query } = require('../config/db');
const { recordAudit } = require('../middleware/auth');

async function getAllEnquiries(req, res) {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM enquiries WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const items = await query(sql, params);
    return res.json({ enquiries: items });
  } catch (err) {
    console.error('Get enquiries error:', err);
    return res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
}

async function createEnquiry(req, res) {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || (!phone && !email)) {
      return res.status(400).json({ error: 'Name and either phone or email are required.' });
    }

    const result = await query(
      'INSERT INTO enquiries (name, phone, email, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), phone ? phone.trim() : '', email ? email.trim() : '', subject || 'General Enquiry', message || '', 'New']
    );

    return res.status(201).json({
      message: 'Enquiry submitted successfully. We will get back to you shortly.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Create enquiry error:', err);
    return res.status(500).json({ error: 'Failed to submit enquiry.' });
  }
}

async function updateEnquiry(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query('UPDATE enquiries SET status = ? WHERE id = ?', [status || 'In Review', id]);
    await recordAudit(req.user?.username || 'Staff', 'UPDATE', 'enquiries', id, { status });
    return res.json({ message: 'Enquiry status updated.' });
  } catch (err) {
    console.error('Update enquiry error:', err);
    return res.status(500).json({ error: 'Failed to update enquiry.' });
  }
}

async function deleteEnquiry(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM enquiries WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'enquiries', id, { id });
    return res.json({ message: 'Enquiry deleted.' });
  } catch (err) {
    console.error('Delete enquiry error:', err);
    return res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
}

module.exports = {
  getAllEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
};

const { logger } = require('../utils/logger');
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
    logger.error('Get enquiries error:', err, 'ENQUIRIES');
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
    logger.error('Create enquiry error:', err, 'ENQUIRIES');
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
    logger.error('Update enquiry error:', err, 'ENQUIRIES');
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
    logger.error('Delete enquiry error:', err, 'ENQUIRIES');
    return res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
}

async function convertToAppointment(req, res) {
  try {
    const { id } = req.params;
    const {
      department,
      doctor_name,
      preferred_date,
      preferred_time,
      status,
      notes,
    } = req.body;

    const existing = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    const enq = existing[0];
    const patientName = req.body.patient_name || enq.name;
    const phone = req.body.phone || enq.phone;
    const email = req.body.email || enq.email;
    const dept = department || 'General Consultation';
    const docName = doctor_name || 'Available Specialist';

    let dateVal = preferred_date;
    if (!dateVal || typeof dateVal !== 'string' || !dateVal.includes('-')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateVal = tomorrow.toISOString().split('T')[0];
    } else {
      dateVal = dateVal.trim().split('T')[0];
    }

    const timeVal = preferred_time || 'Morning (09:00 AM - 01:00 PM)';
    const reasonVal = req.body.reason || `${enq.subject ? enq.subject + ': ' : ''}${enq.message || 'General Consultation'}`;
    const appStatus = status || 'waiting'; // default to waiting as requested
    const internalNotes = notes || `Forwarded from Enquiry #${enq.id} (${enq.name})`;

    const result = await query(
      `INSERT INTO appointments (
        patient_name, phone, email, department, doctor_name, preferred_date,
        preferred_time, reason, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientName.trim(),
        phone ? phone.trim() : '',
        email ? email.trim() : null,
        dept,
        docName,
        dateVal,
        timeVal,
        reasonVal,
        appStatus,
        internalNotes,
      ]
    );

    // Update enquiry status to Contacted
    await query("UPDATE enquiries SET status = 'contacted' WHERE id = ?", [id]);
    await recordAudit(req.user?.username || 'Staff', 'CONVERT_ENQUIRY', 'appointments', result.insertId, { enquiryId: id, patientName });

    return res.status(201).json({
      message: 'Enquiry successfully converted to appointment with Waiting status.',
      appointmentId: result.insertId,
      status: appStatus,
    });
  } catch (err) {
    logger.error('Convert enquiry error:', err, 'ENQUIRIES');
    return res.status(500).json({ error: 'Failed to convert enquiry to appointment.' });
  }
}

module.exports = {
  getAllEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  convertToAppointment,
};

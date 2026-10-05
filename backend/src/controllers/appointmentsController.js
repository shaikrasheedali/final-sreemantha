const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { recordAudit } = require('../middleware/auth');

async function getAllAppointments(req, res) {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM appointments WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (patient_name LIKE ? OR phone LIKE ? OR email LIKE ? OR doctor_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const items = await query(sql, params);
    return res.json({ appointments: items });
  } catch (err) {
    logger.error('Get appointments error:', err, 'APPOINTMENTS');
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
}

async function createAppointment(req, res) {
  try {
    const pName = req.body.patient_name || req.body.name;
    const phoneNum = req.body.phone;
    const emailAddr = req.body.email;
    const dept = req.body.department || 'General OPD';
    const docName = req.body.doctor_name || req.body.doctor || 'Available Specialist';
    
    // Normalize date to YYYY-MM-DD
    let prefDate = req.body.preferred_date || req.body.date;
    if (!prefDate || typeof prefDate !== 'string' || !prefDate.includes('-')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      prefDate = tomorrow.toISOString().split('T')[0];
    } else {
      prefDate = prefDate.trim().split('T')[0];
    }

    const prefTime = req.body.preferred_time || req.body.time || 'Morning (09:00 AM - 01:00 PM)';
    const rsn = req.body.reason || req.body.message || 'General Consultation';
    const nts = req.body.notes || null;

    if (!pName || !phoneNum) {
      return res.status(400).json({ error: 'Patient name and phone number are required.' });
    }

    const result = await query(
      `INSERT INTO appointments (
        patient_name, phone, email, department, doctor_name, preferred_date,
        preferred_time, reason, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pName.trim(),
        phoneNum.trim(),
        emailAddr ? emailAddr.trim() : null,
        dept,
        docName,
        prefDate,
        prefTime,
        rsn,
        'New',
        nts,
      ]
    );

    return res.status(201).json({
      message: 'Appointment request received successfully. Our patient care team will contact you shortly.',
      id: result.insertId,
    });
  } catch (err) {
    logger.error('Create appointment error:', err, 'APPOINTMENTS');
    return res.status(500).json({ error: 'Failed to submit appointment request.' });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { status, notes, doctor_name, department, preferred_date, preferred_time } = req.body;

    await query(
      `UPDATE appointments SET
        status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        doctor_name = COALESCE(?, doctor_name),
        department = COALESCE(?, department),
        preferred_date = COALESCE(?, preferred_date),
        preferred_time = COALESCE(?, preferred_time)
      WHERE id = ?`,
      [status, notes, doctor_name, department, preferred_date, preferred_time, id]
    );

    await recordAudit(req.user?.username || 'Staff', 'UPDATE', 'appointments', id, { status, doctor_name });
    return res.json({ message: 'Appointment updated successfully.' });
  } catch (err) {
    logger.error('Update appointment error:', err, 'APPOINTMENTS');
    return res.status(500).json({ error: 'Failed to update appointment.' });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM appointments WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'appointments', id, { id });
    return res.json({ message: 'Appointment record deleted.' });
  } catch (err) {
    logger.error('Delete appointment error:', err, 'APPOINTMENTS');
    return res.status(500).json({ error: 'Failed to delete appointment.' });
  }
}

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};

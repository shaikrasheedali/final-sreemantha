const { query } = require('../config/db');
const { slugify } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllDepartments(req, res) {
  try {
    const items = await query('SELECT * FROM departments WHERE status = \'published\' ORDER BY id ASC');
    return res.json({ departments: items });
  } catch (err) {
    console.error('Get departments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve departments.' });
  }
}

async function getDepartmentBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM departments WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);
    if (items.length === 0) return res.status(404).json({ error: 'Department not found.' });

    const dept = items[0];
    const doctors = await query('SELECT id, slug, name, designation, photo_url FROM doctors WHERE department LIKE ? AND status = \'published\'', [`%${dept.name}%`]);

    return res.json({ department: dept, doctors });
  } catch (err) {
    console.error('Get department error:', err);
    return res.status(500).json({ error: 'Failed to retrieve department.' });
  }
}

async function createDepartment(req, res) {
  try {
    const { name, slug, tagline, description, head_doctor_name, icon, image_url, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Department name is required.' });

    const deptSlug = (slug || slugify(name)).trim();
    const result = await query(
      'INSERT INTO departments (slug, name, tagline, description, head_doctor_name, icon, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [deptSlug, name, tagline || '', description || '', head_doctor_name || '', icon || 'Building', image_url || '', status || 'published']
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'departments', result.insertId, { name, slug: deptSlug });
    return res.status(201).json({ message: 'Department created.', id: result.insertId, slug: deptSlug });
  } catch (err) {
    console.error('Create department error:', err);
    return res.status(500).json({ error: 'Failed to create department.' });
  }
}

async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, slug, tagline, description, head_doctor_name, icon, image_url, status } = req.body;

    const deptSlug = slug ? slugify(slug) : slugify(name);
    await query(
      'UPDATE departments SET slug = ?, name = ?, tagline = ?, description = ?, head_doctor_name = ?, icon = ?, image_url = ?, status = ? WHERE id = ?',
      [deptSlug, name, tagline, description, head_doctor_name, icon, image_url, status, id]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'departments', id, { name, slug: deptSlug });
    return res.json({ message: 'Department updated.', id, slug: deptSlug });
  } catch (err) {
    console.error('Update department error:', err);
    return res.status(500).json({ error: 'Failed to update department.' });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM departments WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'departments', id, { id });
    return res.json({ message: 'Department deleted.' });
  } catch (err) {
    console.error('Delete department error:', err);
    return res.status(500).json({ error: 'Failed to delete department.' });
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

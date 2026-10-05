const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { slugify, parseJsonField, stringifyJsonField } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllSpecialties(req, res) {
  try {
    const { status, category, search } = req.query;
    let sql = 'SELECT * FROM specialties WHERE 1=1';
    const params = [];

    if (!req.user && status !== 'all') {
      sql += ' AND status = \'published\'';
    } else if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR short_description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY display_order ASC, id ASC';
    const items = await query(sql, params);

    return res.json({
      specialties: items.map(s => ({
        ...s,
        conditions: parseJsonField(s.conditions, []),
      })),
    });
  } catch (err) {
    logger.error('Get specialties error:', err, 'SPECIALTIES');
    return res.status(500).json({ error: 'Failed to retrieve specialties.' });
  }
}

async function getSpecialtyBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM specialties WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Specialty not found.' });
    }

    const item = items[0];

    // Fetch related treatments for this specialty
    const relatedTreatments = await query(
      'SELECT id, slug, title, short_description, category, image_url FROM treatments WHERE specialty_slug = ? AND status = \'published\'',
      [item.slug]
    );

    return res.json({
      specialty: {
        ...item,
        conditions: parseJsonField(item.conditions, []),
      },
      relatedTreatments,
    });
  } catch (err) {
    logger.error('Get specialty error:', err, 'SPECIALTIES');
    return res.status(500).json({ error: 'Failed to retrieve specialty details.' });
  }
}

async function createSpecialty(req, res) {
  try {
    const { title, slug, category, short_description, overview, icon, image_url, conditions, display_order, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Specialty title is required.' });
    }

    const specialtySlug = (slug || slugify(title)).trim();
    const existing = await query('SELECT id FROM specialties WHERE slug = ?', [specialtySlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A specialty with this slug already exists.' });
    }

    const result = await query(
      'INSERT INTO specialties (slug, title, category, short_description, overview, icon, image_url, conditions, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        specialtySlug,
        title.trim(),
        category || 'General',
        short_description || '',
        overview || '',
        icon || 'HeartPulse',
        image_url || '',
        stringifyJsonField(conditions),
        display_order || 0,
        status || 'published',
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'specialties', result.insertId, { title, slug: specialtySlug });

    return res.status(201).json({
      message: 'Specialty created successfully.',
      id: result.insertId,
      slug: specialtySlug,
    });
  } catch (err) {
    logger.error('Create specialty error:', err, 'SPECIALTIES');
    return res.status(500).json({ error: 'Failed to create specialty.' });
  }
}

async function updateSpecialty(req, res) {
  try {
    const { id } = req.params;
    const { title, slug, category, short_description, overview, icon, image_url, conditions, display_order, status } = req.body;

    const existing = await query('SELECT id, title FROM specialties WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Specialty not found.' });
    }

    const specialtySlug = slug ? slugify(slug) : slugify(title || existing[0].title);

    await query(
      'UPDATE specialties SET slug = ?, title = ?, category = ?, short_description = ?, overview = ?, icon = ?, image_url = ?, conditions = ?, display_order = ?, status = ? WHERE id = ?',
      [
        specialtySlug,
        title,
        category || 'General',
        short_description || '',
        overview || '',
        icon || 'HeartPulse',
        image_url || '',
        stringifyJsonField(conditions),
        display_order || 0,
        status || 'published',
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'specialties', id, { title, slug: specialtySlug });

    return res.json({ message: 'Specialty updated successfully.', id, slug: specialtySlug });
  } catch (err) {
    logger.error('Update specialty error:', err, 'SPECIALTIES');
    return res.status(500).json({ error: 'Failed to update specialty.' });
  }
}

async function deleteSpecialty(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title FROM specialties WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Specialty not found.' });
    }

    await query('DELETE FROM specialties WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'specialties', id, { title: existing[0].title });

    return res.json({ message: 'Specialty deleted successfully.' });
  } catch (err) {
    logger.error('Delete specialty error:', err, 'SPECIALTIES');
    return res.status(500).json({ error: 'Failed to delete specialty.' });
  }
}

module.exports = {
  getAllSpecialties,
  getSpecialtyBySlug,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};

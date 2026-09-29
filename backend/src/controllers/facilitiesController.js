const { query } = require('../config/db');
const { slugify, parseJsonField, stringifyJsonField } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllFacilities(req, res) {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM facilities WHERE 1=1';
    const params = [];

    // If not authenticated or public query, default to published only unless explicitly requested by staff/admin
    if (!req.user && status !== 'all') {
      sql += ' AND status = \'published\'';
    } else if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR short_description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY display_order ASC, id ASC';
    const items = await query(sql, params);

    return res.json({
      facilities: items.map(f => ({
        ...f,
        equipment: parseJsonField(f.equipment, []),
      })),
    });
  } catch (err) {
    console.error('Get facilities error:', err);
    return res.status(500).json({ error: 'Failed to retrieve facilities.' });
  }
}

async function getFacilityBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM facilities WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Facility not found.' });
    }

    const item = items[0];
    return res.json({
      facility: {
        ...item,
        equipment: parseJsonField(item.equipment, []),
      },
    });
  } catch (err) {
    console.error('Get facility error:', err);
    return res.status(500).json({ error: 'Failed to retrieve facility details.' });
  }
}

async function createFacility(req, res) {
  try {
    const { name, slug, short_description, description, equipment, image_url, status, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Facility name is required.' });
    }

    const facilitySlug = (slug || slugify(name)).trim();
    const existing = await query('SELECT id FROM facilities WHERE slug = ?', [facilitySlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A facility with this slug already exists.' });
    }

    const result = await query(
      'INSERT INTO facilities (slug, name, short_description, description, equipment, image_url, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        facilitySlug,
        name.trim(),
        short_description || '',
        description || '',
        stringifyJsonField(equipment),
        image_url || '',
        status || 'published',
        display_order || 0,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'facilities', result.insertId, { name, slug: facilitySlug });

    return res.status(201).json({
      message: 'Facility created successfully.',
      id: result.insertId,
      slug: facilitySlug,
    });
  } catch (err) {
    console.error('Create facility error:', err);
    return res.status(500).json({ error: 'Failed to create facility.' });
  }
}

async function updateFacility(req, res) {
  try {
    const { id } = req.params;
    const { name, slug, short_description, description, equipment, image_url, status, display_order } = req.body;

    const existing = await query('SELECT id, name FROM facilities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Facility not found.' });
    }

    const facilitySlug = slug ? slugify(slug) : slugify(name || existing[0].name);

    await query(
      'UPDATE facilities SET slug = ?, name = ?, short_description = ?, description = ?, equipment = ?, image_url = ?, status = ?, display_order = ? WHERE id = ?',
      [
        facilitySlug,
        name,
        short_description || '',
        description || '',
        stringifyJsonField(equipment),
        image_url || '',
        status || 'published',
        display_order || 0,
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'facilities', id, { name, slug: facilitySlug });

    return res.json({ message: 'Facility updated successfully.', id, slug: facilitySlug });
  } catch (err) {
    console.error('Update facility error:', err);
    return res.status(500).json({ error: 'Failed to update facility.' });
  }
}

async function deleteFacility(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM facilities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Facility not found.' });
    }

    await query('DELETE FROM facilities WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'facilities', id, { name: existing[0].name });

    return res.json({ message: 'Facility deleted successfully.' });
  } catch (err) {
    console.error('Delete facility error:', err);
    return res.status(500).json({ error: 'Failed to delete facility.' });
  }
}

module.exports = {
  getAllFacilities,
  getFacilityBySlug,
  createFacility,
  updateFacility,
  deleteFacility,
};

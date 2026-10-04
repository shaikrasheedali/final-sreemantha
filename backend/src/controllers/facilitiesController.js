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
    const facilityName = (name || req.body.title || '').trim();
    const facilityDesc = description || req.body.content || req.body.overview || '';

    if (!facilityName) {
      return res.status(400).json({ error: 'Facility name is required.' });
    }

    const facilitySlug = (slug || slugify(facilityName)).trim();
    const existing = await query('SELECT id FROM facilities WHERE slug = ?', [facilitySlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A facility with this slug already exists.' });
    }

    const result = await query(
      'INSERT INTO facilities (slug, name, short_description, description, equipment, image_url, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        facilitySlug,
        facilityName,
        short_description || '',
        facilityDesc,
        stringifyJsonField(equipment),
        image_url || '',
        status || 'published',
        display_order || 0,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'facilities', result.insertId, { name: facilityName, slug: facilitySlug });

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

    const existing = await query('SELECT * FROM facilities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Facility not found.' });
    }

    const current = existing[0];
    const facilityName = (name || req.body.title || current.name).trim();
    const facilityDesc = description !== undefined ? description : (req.body.content !== undefined ? req.body.content : (req.body.overview !== undefined ? req.body.overview : current.description));
    const facilityShortDesc = short_description !== undefined ? short_description : (req.body.summary !== undefined ? req.body.summary : current.short_description);
    const facilitySlug = slug ? slugify(slug) : (current.slug || slugify(facilityName));
    const facilityEquipment = equipment !== undefined ? equipment : current.equipment;
    const facilityImageUrl = image_url !== undefined ? image_url : (req.body.image !== undefined ? req.body.image : current.image_url);
    const facilityStatus = status !== undefined ? status : current.status;
    const facilityOrder = display_order !== undefined ? display_order : current.display_order;

    await query(
      'UPDATE facilities SET slug = ?, name = ?, short_description = ?, description = ?, equipment = ?, image_url = ?, status = ?, display_order = ? WHERE id = ?',
      [
        facilitySlug,
        facilityName,
        facilityShortDesc,
        facilityDesc,
        stringifyJsonField(facilityEquipment),
        facilityImageUrl,
        facilityStatus,
        facilityOrder,
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'facilities', id, { name: facilityName, slug: facilitySlug });

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

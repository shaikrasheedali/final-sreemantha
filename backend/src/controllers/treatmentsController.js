const { query } = require('../config/db');
const { slugify, parseJsonField, stringifyJsonField } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllTreatments(req, res) {
  try {
    const { status, category, specialty, featured, search } = req.query;
    let sql = 'SELECT * FROM treatments WHERE 1=1';
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

    if (specialty) {
      sql += ' AND specialty_slug = ?';
      params.push(specialty);
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND featured = 1';
    }

    if (search) {
      sql += ' AND (title LIKE ? OR short_description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY featured DESC, id ASC';
    const items = await query(sql, params);

    return res.json({
      treatments: items.map(t => ({
        ...t,
        how_it_works: parseJsonField(t.how_it_works, []),
        who_requires: parseJsonField(t.who_requires, []),
      })),
    });
  } catch (err) {
    console.error('Get treatments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve treatments.' });
  }
}

async function getTreatmentBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM treatments WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Treatment not found.' });
    }

    const item = items[0];

    // Fetch related specialty
    let specialty = null;
    if (item.specialty_slug) {
      const specRows = await query('SELECT id, slug, title, category FROM specialties WHERE slug = ? LIMIT 1', [item.specialty_slug]);
      if (specRows.length > 0) specialty = specRows[0];
    }

    // Fetch doctors in same department or related
    const doctors = await query('SELECT id, slug, name, designation, photo_url, experience_years, qualifications FROM doctors WHERE status = \'published\' LIMIT 4');

    return res.json({
      treatment: {
        ...item,
        how_it_works: parseJsonField(item.how_it_works, []),
        who_requires: parseJsonField(item.who_requires, []),
      },
      specialty,
      relatedDoctors: doctors,
    });
  } catch (err) {
    console.error('Get treatment error:', err);
    return res.status(500).json({ error: 'Failed to retrieve treatment details.' });
  }
}

async function createTreatment(req, res) {
  try {
    const {
      title,
      slug,
      category,
      specialty_slug,
      short_description,
      overview,
      how_it_works,
      who_requires,
      preparation,
      aftercare,
      typical_duration,
      success_rate,
      image_url,
      featured,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Treatment title is required.' });
    }

    const treatmentSlug = (slug || slugify(title)).trim();
    const existing = await query('SELECT id FROM treatments WHERE slug = ?', [treatmentSlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A treatment with this slug already exists.' });
    }

    const result = await query(
      `INSERT INTO treatments (
        slug, title, category, specialty_slug, short_description, overview,
        how_it_works, who_requires, preparation, aftercare, typical_duration,
        success_rate, image_url, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        treatmentSlug,
        title.trim(),
        category || 'Fertility Care',
        specialty_slug || '',
        short_description || '',
        overview || '',
        stringifyJsonField(how_it_works),
        stringifyJsonField(who_requires),
        preparation || '',
        aftercare || '',
        typical_duration || '',
        success_rate || '',
        image_url || '',
        featured ? 1 : 0,
        status || 'published',
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'treatments', result.insertId, { title, slug: treatmentSlug });

    return res.status(201).json({
      message: 'Treatment created successfully.',
      id: result.insertId,
      slug: treatmentSlug,
    });
  } catch (err) {
    console.error('Create treatment error:', err);
    return res.status(500).json({ error: 'Failed to create treatment.' });
  }
}

async function updateTreatment(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      specialty_slug,
      short_description,
      overview,
      how_it_works,
      who_requires,
      preparation,
      aftercare,
      typical_duration,
      success_rate,
      image_url,
      featured,
      status,
    } = req.body;

    const existing = await query('SELECT id, title FROM treatments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Treatment not found.' });
    }

    const treatmentSlug = slug ? slugify(slug) : slugify(title || existing[0].title);

    await query(
      `UPDATE treatments SET
        slug = ?, title = ?, category = ?, specialty_slug = ?, short_description = ?,
        overview = ?, how_it_works = ?, who_requires = ?, preparation = ?,
        aftercare = ?, typical_duration = ?, success_rate = ?, image_url = ?,
        featured = ?, status = ?
      WHERE id = ?`,
      [
        treatmentSlug,
        title,
        category || 'Fertility Care',
        specialty_slug || '',
        short_description || '',
        overview || '',
        stringifyJsonField(how_it_works),
        stringifyJsonField(who_requires),
        preparation || '',
        aftercare || '',
        typical_duration || '',
        success_rate || '',
        image_url || '',
        featured ? 1 : 0,
        status || 'published',
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'treatments', id, { title, slug: treatmentSlug });

    return res.json({ message: 'Treatment updated successfully.', id, slug: treatmentSlug });
  } catch (err) {
    console.error('Update treatment error:', err);
    return res.status(500).json({ error: 'Failed to update treatment.' });
  }
}

async function deleteTreatment(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title FROM treatments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Treatment not found.' });
    }

    await query('DELETE FROM treatments WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'treatments', id, { title: existing[0].title });

    return res.json({ message: 'Treatment deleted successfully.' });
  } catch (err) {
    console.error('Delete treatment error:', err);
    return res.status(500).json({ error: 'Failed to delete treatment.' });
  }
}

module.exports = {
  getAllTreatments,
  getTreatmentBySlug,
  createTreatment,
  updateTreatment,
  deleteTreatment,
};

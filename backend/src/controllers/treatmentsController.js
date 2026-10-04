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

    const treatmentTitle = (title || req.body.name || '').trim();
    if (!treatmentTitle) {
      return res.status(400).json({ error: 'Treatment title is required.' });
    }

    const treatmentSlug = (slug || slugify(treatmentTitle)).trim();
    const existing = await query('SELECT id FROM treatments WHERE slug = ?', [treatmentSlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A treatment with this slug already exists.' });
    }

    const treatmentOverview = overview || req.body.content || '';
    const treatmentHowItWorks = how_it_works !== undefined ? how_it_works : req.body.howItWorks;

    const result = await query(
      `INSERT INTO treatments (
        slug, title, category, specialty_slug, short_description, overview,
        how_it_works, who_requires, preparation, aftercare, typical_duration,
        success_rate, image_url, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        treatmentSlug,
        treatmentTitle,
        category || 'Fertility Care',
        specialty_slug || '',
        short_description || '',
        treatmentOverview,
        stringifyJsonField(treatmentHowItWorks),
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

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'treatments', result.insertId, { title: treatmentTitle, slug: treatmentSlug });

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

    const existing = await query('SELECT * FROM treatments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Treatment not found.' });
    }

    const current = existing[0];
    const treatmentTitle = (title || req.body.name || current.title).trim();
    const treatmentSlug = slug ? slugify(slug) : (current.slug || slugify(treatmentTitle));
    const treatmentCategory = category !== undefined ? category : current.category;
    const treatmentSpecialtySlug = specialty_slug !== undefined ? specialty_slug : current.specialty_slug;
    const treatmentShortDesc = short_description !== undefined ? short_description : (req.body.summary !== undefined ? req.body.summary : current.short_description);
    const treatmentOverview = overview !== undefined ? overview : (req.body.content !== undefined ? req.body.content : (req.body.description !== undefined ? req.body.description : current.overview));
    const rawHow = how_it_works !== undefined ? how_it_works : (req.body.howItWorks !== undefined ? req.body.howItWorks : current.how_it_works);
    const treatmentWhoRequires = who_requires !== undefined ? who_requires : current.who_requires;
    const treatmentPrep = preparation !== undefined ? preparation : current.preparation;
    const treatmentAftercare = aftercare !== undefined ? aftercare : current.aftercare;
    const treatmentDuration = typical_duration !== undefined ? typical_duration : current.typical_duration;
    const treatmentSuccessRate = success_rate !== undefined ? success_rate : current.success_rate;
    const treatmentImageUrl = image_url !== undefined ? image_url : (req.body.image !== undefined ? req.body.image : current.image_url);
    const treatmentFeatured = featured !== undefined ? (featured ? 1 : 0) : current.featured;
    const treatmentStatus = status !== undefined ? status : current.status;

    await query(
      `UPDATE treatments SET
        slug = ?, title = ?, category = ?, specialty_slug = ?, short_description = ?,
        overview = ?, how_it_works = ?, who_requires = ?, preparation = ?,
        aftercare = ?, typical_duration = ?, success_rate = ?, image_url = ?,
        featured = ?, status = ?
      WHERE id = ?`,
      [
        treatmentSlug,
        treatmentTitle,
        treatmentCategory,
        treatmentSpecialtySlug,
        treatmentShortDesc,
        treatmentOverview,
        stringifyJsonField(rawHow),
        stringifyJsonField(treatmentWhoRequires),
        treatmentPrep,
        treatmentAftercare,
        treatmentDuration,
        treatmentSuccessRate,
        treatmentImageUrl,
        treatmentFeatured,
        treatmentStatus,
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'treatments', id, { title: treatmentTitle, slug: treatmentSlug });

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

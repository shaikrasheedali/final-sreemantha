const { query } = require('../config/db');
const { slugify, parseJsonField, stringifyJsonField } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllDoctors(req, res) {
  try {
    const { status, department, featured, search } = req.query;
    let sql = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (!req.user && status !== 'all') {
      sql += ' AND status = \'published\'';
    } else if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (department && department !== 'All') {
      sql += ' AND department = ?';
      params.push(department);
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND featured = 1';
    }

    if (search) {
      sql += ' AND (name LIKE ? OR designation LIKE ? OR department LIKE ? OR qualifications LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY display_order ASC, id ASC';
    const items = await query(sql, params);

    return res.json({
      doctors: items.map(d => ({
        ...d,
        languages: parseJsonField(d.languages, ['English', 'Telugu']),
        education: parseJsonField(d.education, []),
        certifications: parseJsonField(d.certifications, []),
      })),
    });
  } catch (err) {
    console.error('Get doctors error:', err);
    return res.status(500).json({ error: 'Failed to retrieve doctors.' });
  }
}

async function getDoctorBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM doctors WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const item = items[0];

    // Fetch related treatments
    const relatedTreatments = await query(
      'SELECT id, slug, title, category, short_description FROM treatments WHERE status = \'published\' LIMIT 3'
    );

    return res.json({
      doctor: {
        ...item,
        languages: parseJsonField(item.languages, ['English', 'Telugu']),
        education: parseJsonField(item.education, []),
        certifications: parseJsonField(item.certifications, []),
      },
      relatedTreatments,
    });
  } catch (err) {
    console.error('Get doctor error:', err);
    return res.status(500).json({ error: 'Failed to retrieve doctor details.' });
  }
}

async function createDoctor(req, res) {
  try {
    const {
      name,
      slug,
      designation,
      department,
      qualifications,
      experience_years,
      languages,
      short_bio,
      full_bio,
      education,
      certifications,
      opd_timings,
      photo_url,
      featured,
      display_order,
      status,
    } = req.body;

    const doctorName = (name || req.body.title || '').trim();
    if (!doctorName) {
      return res.status(400).json({ error: 'Doctor name is required.' });
    }

    const doctorSlug = (slug || slugify(doctorName)).trim();
    const existing = await query('SELECT id FROM doctors WHERE slug = ?', [doctorSlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A doctor with this slug already exists.' });
    }

    const doctorDept = department || req.body.specialty || 'General Medicine';
    const doctorBio = full_bio || req.body.bio || short_bio || '';

    const result = await query(
      `INSERT INTO doctors (
        slug, name, designation, department, qualifications, experience_years,
        languages, short_bio, full_bio, education, certifications,
        opd_timings, photo_url, featured, display_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorSlug,
        doctorName,
        designation || 'Consultant Specialist',
        doctorDept,
        qualifications || '',
        experience_years || 0,
        stringifyJsonField(languages),
        short_bio || '',
        doctorBio,
        stringifyJsonField(education),
        stringifyJsonField(certifications),
        opd_timings || '10:00 AM - 02:00 PM',
        photo_url || '',
        featured ? 1 : 0,
        display_order || 0,
        status || 'published',
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'doctors', result.insertId, { name, slug: doctorSlug });

    return res.status(201).json({
      message: 'Doctor created successfully.',
      id: result.insertId,
      slug: doctorSlug,
    });
  } catch (err) {
    console.error('Create doctor error:', err);
    return res.status(500).json({ error: 'Failed to create doctor.' });
  }
}

async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      designation,
      department,
      qualifications,
      experience_years,
      languages,
      short_bio,
      full_bio,
      education,
      certifications,
      opd_timings,
      photo_url,
      featured,
      display_order,
      status,
    } = req.body;

    const existing = await query('SELECT * FROM doctors WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const current = existing[0];
    const doctorName = (name || req.body.title || current.name).trim();
    const doctorSlug = slug ? slugify(slug) : (current.slug || slugify(doctorName));
    const doctorDesignation = designation !== undefined ? designation : current.designation;
    const doctorDept = department !== undefined ? department : (req.body.specialty !== undefined ? req.body.specialty : current.department);
    const doctorQualifications = qualifications !== undefined ? qualifications : current.qualifications;
    const doctorExp = experience_years !== undefined ? experience_years : current.experience_years;
    const doctorLanguages = languages !== undefined ? languages : current.languages;
    const doctorShortBio = short_bio !== undefined ? short_bio : (req.body.summary !== undefined ? req.body.summary : current.short_bio);
    const doctorBio = full_bio !== undefined ? full_bio : (req.body.bio !== undefined ? req.body.bio : (req.body.content !== undefined ? req.body.content : current.full_bio));
    const doctorEducation = education !== undefined ? education : current.education;
    const doctorCerts = certifications !== undefined ? certifications : current.certifications;
    const doctorOpd = opd_timings !== undefined ? opd_timings : current.opd_timings;
    const doctorPhoto = photo_url !== undefined ? photo_url : (req.body.image !== undefined ? req.body.image : current.photo_url);
    const doctorFeatured = featured !== undefined ? (featured ? 1 : 0) : current.featured;
    const doctorOrder = display_order !== undefined ? display_order : current.display_order;
    const doctorStatus = status !== undefined ? status : current.status;

    await query(
      `UPDATE doctors SET
        slug = ?, name = ?, designation = ?, department = ?, qualifications = ?,
        experience_years = ?, languages = ?, short_bio = ?, full_bio = ?,
        education = ?, certifications = ?, opd_timings = ?, photo_url = ?,
        featured = ?, display_order = ?, status = ?
      WHERE id = ?`,
      [
        doctorSlug,
        doctorName,
        doctorDesignation,
        doctorDept,
        doctorQualifications,
        doctorExp,
        stringifyJsonField(doctorLanguages),
        doctorShortBio,
        doctorBio,
        stringifyJsonField(doctorEducation),
        stringifyJsonField(doctorCerts),
        doctorOpd,
        doctorPhoto,
        doctorFeatured,
        doctorOrder,
        doctorStatus,
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'doctors', id, { name: doctorName, slug: doctorSlug });

    return res.json({ message: 'Doctor updated successfully.', id, slug: doctorSlug });
  } catch (err) {
    console.error('Update doctor error:', err);
    return res.status(500).json({ error: 'Failed to update doctor.' });
  }
}

async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM doctors WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    await query('DELETE FROM doctors WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'doctors', id, { name: existing[0].name });

    return res.json({ message: 'Doctor deleted successfully.' });
  } catch (err) {
    console.error('Delete doctor error:', err);
    return res.status(500).json({ error: 'Failed to delete doctor.' });
  }
}

module.exports = {
  getAllDoctors,
  getDoctorBySlug,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};

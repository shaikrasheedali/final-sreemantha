const { query } = require('../config/db');

async function getDashboardStats(req, res) {
  try {
    const [facilitiesCount] = await query('SELECT COUNT(*) as c FROM facilities');
    const [specialtiesCount] = await query('SELECT COUNT(*) as c FROM specialties');
    const [treatmentsCount] = await query('SELECT COUNT(*) as c FROM treatments');
    const [doctorsCount] = await query('SELECT COUNT(*) as c FROM doctors');
    const [galleryCount] = await query('SELECT COUNT(*) as c FROM gallery_items');
    const [insightsCount] = await query('SELECT COUNT(*) as c FROM blog_posts');
    const [appointmentsCount] = await query('SELECT COUNT(*) as c FROM appointments');
    const [enquiriesCount] = await query('SELECT COUNT(*) as c FROM enquiries');

    const recentAppointments = await query('SELECT id, patient_name, phone, department, doctor_name, preferred_date, status FROM appointments ORDER BY id DESC LIMIT 5');
    const recentEnquiries = await query('SELECT id, name, phone, subject, status, created_at FROM enquiries ORDER BY id DESC LIMIT 5');
    const recentAudit = await query('SELECT id, user_name, action, entity_type, created_at FROM audit_logs ORDER BY id DESC LIMIT 6');

    return res.json({
      counts: {
        facilities: facilitiesCount ? facilitiesCount.c : 0,
        specialties: specialtiesCount ? specialtiesCount.c : 0,
        treatments: treatmentsCount ? treatmentsCount.c : 0,
        doctors: doctorsCount ? doctorsCount.c : 0,
        gallery: galleryCount ? galleryCount.c : 0,
        insights: insightsCount ? insightsCount.c : 0,
        appointments: appointmentsCount ? appointmentsCount.c : 0,
        enquiries: enquiriesCount ? enquiriesCount.c : 0,
      },
      recentAppointments,
      recentEnquiries,
      recentAudit,
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
}

module.exports = {
  getDashboardStats,
};

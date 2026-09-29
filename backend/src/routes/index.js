const express = require('express');
const { testConnection } = require('../config/db');

const authRoutes = require('./authRoutes');
const facilitiesRoutes = require('./facilitiesRoutes');
const specialtiesRoutes = require('./specialtiesRoutes');
const treatmentsRoutes = require('./treatmentsRoutes');
const doctorsRoutes = require('./doctorsRoutes');
const galleryRoutes = require('./galleryRoutes');
const insightsRoutes = require('./insightsRoutes');
const insuranceRoutes = require('./insuranceRoutes');
const appointmentsRoutes = require('./appointmentsRoutes');
const enquiriesRoutes = require('./enquiriesRoutes');
const settingsRoutes = require('./settingsRoutes');
const departmentsRoutes = require('./departmentsRoutes');
const faqsRoutes = require('./faqsRoutes');
const statsRoutes = require('./statsRoutes');
const auditRoutes = require('./auditRoutes');
const mediaRoutes = require('./mediaRoutes');

const router = express.Router();

// Health check endpoint for Render Cloud and monitoring
router.get('/health', async (req, res) => {
  const dbHealth = await testConnection();
  const statusCode = dbHealth.ok ? 200 : 503;
  return res.status(statusCode).json({
    status: dbHealth.ok ? 'ok' : 'degraded',
    service: 'Sreemantha Hospital Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbHealth.ok ? 'connected' : 'error',
    error: dbHealth.error || null,
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/facilities', facilitiesRoutes);
router.use('/specialties', specialtiesRoutes);
router.use('/treatments', treatmentsRoutes);
router.use('/doctors', doctorsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/insights', insightsRoutes);
router.use('/blog', insightsRoutes); // alias
router.use('/insurance', insuranceRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/enquiries', enquiriesRoutes);
router.use('/settings', settingsRoutes);
router.use('/departments', departmentsRoutes);
router.use('/faqs', faqsRoutes);
router.use('/dashboard/stats', statsRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/media', mediaRoutes);

module.exports = router;

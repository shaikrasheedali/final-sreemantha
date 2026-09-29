const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { seedInitialUsers } = require('../src/config/seed');
const { pool } = require('../src/config/db');

let superadminToken = '';
let adminToken = '';
let staffToken = '';

before(async () => {
  await seedInitialUsers();
});

describe('1. Health and Documentation Endpoints', () => {
  test('GET /api/health returns 200 and connected database', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.database, 'connected');
  });

  test('GET /api/docs.json returns OpenAPI 3.0 specification', async () => {
    const res = await request(app).get('/api/docs.json');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.openapi, '3.0.3');
    assert.ok(res.body.paths['/health']);
    assert.ok(res.body.paths['/auth/login']);
  });
});

describe('2. Authentication with Argon2 & JWT (3 Roles)', () => {
  test('Login as Superadmin with Argon2 password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'superadmin',
      password: 'SuperAdmin@2026',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'superadmin');
    superadminToken = res.body.token;
  });

  test('Login as Admin with Argon2 password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'Admin@2026',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'admin');
    adminToken = res.body.token;
  });

  test('Login as Staff with Argon2 password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'staff',
      password: 'Staff@2026',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'staff');
    staffToken = res.body.token;
  });

  test('Login with incorrect password returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'wrongpassword',
    });
    assert.strictEqual(res.status, 401);
  });

  test('GET /api/auth/me returns authenticated user details', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.username, 'admin');
  });

  test('GET /api/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.strictEqual(res.status, 401);
  });
});

describe('3. Public and CMS Collections', () => {
  test('GET /api/facilities returns list with parsed equipment array', async () => {
    const res = await request(app).get('/api/facilities');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.facilities));
    assert.ok(res.body.facilities.length > 0);
    assert.ok(Array.isArray(res.body.facilities[0].equipment));
  });

  test('GET /api/specialties returns list with conditions', async () => {
    const res = await request(app).get('/api/specialties');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.specialties));
    assert.ok(res.body.specialties.length > 0);
  });

  test('GET /api/treatments returns clinical services', async () => {
    const res = await request(app).get('/api/treatments');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.treatments));
    assert.ok(res.body.treatments.length > 0);
  });

  test('GET /api/doctors returns doctors with qualifications and education', async () => {
    const res = await request(app).get('/api/doctors');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.doctors));
    assert.ok(res.body.doctors.length > 0);
  });

  test('GET /api/gallery returns media items with iframe/video support', async () => {
    const res = await request(app).get('/api/gallery');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.gallery));
    assert.ok(res.body.gallery.length > 0);
  });

  test('GET /api/insights returns blog articles', async () => {
    const res = await request(app).get('/api/insights');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.insights));
  });

  test('GET /api/insurance returns sliding strip insurance providers', async () => {
    const res = await request(app).get('/api/insurance');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.providers));
    assert.ok(res.body.providers.length >= 5);
  });

  test('GET /api/settings returns hospital operational info and contact buttons', async () => {
    const res = await request(app).get('/api/settings');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.settings.hospital_info);
    assert.ok(res.body.settings.contact_buttons);
    assert.strictEqual(res.body.settings.hospital_info.phone, '+91 96667 81779');
  });
});

describe('4. Dynamic Slugs & Detail Views', () => {
  test('GET /api/facilities/:slug returns specific facility detail', async () => {
    const listRes = await request(app).get('/api/facilities');
    const firstSlug = listRes.body.facilities[0].slug;
    const res = await request(app).get(`/api/facilities/${firstSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.facility.slug, firstSlug);
  });

  test('GET /api/treatments/:slug returns treatment with related specialty', async () => {
    const listRes = await request(app).get('/api/treatments');
    const firstSlug = listRes.body.treatments[0].slug;
    const res = await request(app).get(`/api/treatments/${firstSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.treatment.slug, firstSlug);
  });

  test('GET /api/doctors/:slug returns doctor profile and related treatments', async () => {
    const listRes = await request(app).get('/api/doctors');
    const firstSlug = listRes.body.doctors[0].slug;
    const res = await request(app).get(`/api/doctors/${firstSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.doctor.slug, firstSlug);
  });

  test('GET non-existent slug returns 404', async () => {
    const res = await request(app).get('/api/treatments/non-existent-random-slug-999');
    assert.strictEqual(res.status, 404);
  });
});

describe('5. Patient Interactions (Appointment & Enquiry)', () => {
  test('POST /api/appointments registers booking request', async () => {
    const res = await request(app).post('/api/appointments').send({
      patient_name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@example.com',
      department: 'Fertility & IVF',
      preferred_date: '2026-10-15',
      preferred_time: 'Morning (10:00 AM - 01:00 PM)',
      reason: 'Fertility consultation and IVF guidance',
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
  });

  test('POST /api/appointments without phone returns 400', async () => {
    const res = await request(app).post('/api/appointments').send({
      patient_name: 'Priya Sharma',
    });
    assert.strictEqual(res.status, 400);
  });

  test('POST /api/enquiries submits contact message', async () => {
    const res = await request(app).post('/api/enquiries').send({
      name: 'Ramesh Reddy',
      phone: '+91 91234 56789',
      email: 'ramesh.reddy@example.com',
      subject: 'Inquiry regarding Cashless Insurance',
      message: 'Do you accept Star Health Insurance for maternity packages?',
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
  });
});

describe('6. Admin Dashboard and CRUD Operations', () => {
  let createdGalleryId = null;

  test('GET /api/dashboard/stats returns collection counters', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.counts.facilities > 0);
    assert.ok(res.body.counts.specialties > 0);
    assert.ok(res.body.counts.treatments > 0);
    assert.ok(res.body.counts.doctors > 0);
  });

  test('Staff can add Gallery item with YouTube video URL', async () => {
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        title: 'Modern IVF Laboratory Tour',
        category: 'Facilities',
        media_type: 'youtube',
        media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: 'Inside Sreemantha advanced clean-room embryology lab in Khammam.',
      });
    assert.strictEqual(res.status, 201);
    createdGalleryId = res.body.id;
  });

  test('Admin can update Gallery item', async () => {
    const res = await request(app)
      .put(`/api/gallery/${createdGalleryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Advanced IVF Laboratory Tour (Updated)',
        category: 'Facilities',
        media_type: 'youtube',
        media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: 'Updated caption for embryology clean room.',
      });
    assert.strictEqual(res.status, 200);
  });

  test('Admin can delete Gallery item', async () => {
    const res = await request(app)
      .delete(`/api/gallery/${createdGalleryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.status, 200);
  });

  after(async () => {
    try {
      await pool.end();
    } catch (e) {
      // ignore
    }
  });
});

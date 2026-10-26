const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('New Features & Enhancements Verification', () => {
  let superadminToken = '';
  let adminToken = '';
  let createdEnquiryId = null;
  let testStaffId = null;

  it('Login as superadmin and admin', async () => {
    const superRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'superadmin', password: 'SuperAdmin@2026' });
    assert.equal(superRes.status, 200);
    assert.ok(superRes.body.token);
    superadminToken = superRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin@2026' });
    assert.equal(adminRes.status, 200);
    assert.ok(adminRes.body.token);
    adminToken = adminRes.body.token;
  });

  it('Superadmin can view users and stored_passwords', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.users));
    const superadminUser = res.body.users.find(u => u.username === 'superadmin');
    assert.ok(superadminUser);
    assert.equal(superadminUser.stored_password, 'SuperAdmin@2026');
  });

  it('Admin users view is blind to the superadmin account entirely', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.users));

    const superadminUser = res.body.users.find((u) =>
      JSON.stringify(u).toLowerCase().replace(/[^a-z0-9]+/g, '').includes('superadmin')
    );
    assert.equal(superadminUser, undefined); // Stealth: no superadmin record at all

    const staffUser = res.body.users.find(u => u.role === 'staff');
    if (staffUser) {
      assert.ok(staffUser.stored_password); // Admin CAN see staff password
    }
  });

  it('Admin audit trail never mentions the superadmin identity', async () => {
    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.auditLogs));

    for (const entry of res.body.auditLogs) {
      const haystack = JSON.stringify(entry).toLowerCase().replace(/[^a-z0-9]+/g, '');
      assert.ok(!haystack.includes('superadmin'));
    }
  });

  it('Admin cannot discover the superadmin account through direct user mutations', async () => {
    const usersRes = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${superadminToken}`);
    const superadminUser = usersRes.body.users.find((u) => u.username === 'superadmin');
    assert.ok(superadminUser);

    const updateRes = await request(app)
      .put(`/api/auth/users/${superadminUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'staff' });
    assert.equal(updateRes.status, 404);
    assert.equal(updateRes.body.error, 'User not found.');

    const deleteRes = await request(app)
      .delete(`/api/auth/users/${superadminUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(deleteRes.status, 404);
    assert.equal(deleteRes.body.error, 'User not found.');
  });

  it('Admin can create a new staff user with stored password', async () => {
    const testUsername = `teststaff_${Date.now()}`;
    const res = await request(app)
      .post('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: testUsername,
        email: `${testUsername}@example.com`,
        password: 'TestPassword123!',
        name: 'Test Staff User',
        role: 'staff',
      });
    assert.equal(res.status, 201);
    assert.ok(res.body.user);
    assert.equal(res.body.user.stored_password, 'TestPassword123!');
    testStaffId = res.body.user.id;
  });

  it('Admin cannot create a superadmin user (escalation forbidden)', async () => {
    const res = await request(app)
      .post('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: `hack_${Date.now()}`,
        email: `hack_${Date.now()}@example.com`,
        password: 'Pass',
        role: 'superadmin',
      });
    assert.equal(res.status, 403);
  });

  it('Admin can update staff user password and credentials', async () => {
    assert.ok(testStaffId);
    const res = await request(app)
      .put(`/api/auth/users/${testStaffId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        password: 'UpdatedPassword456!',
        name: 'Updated Staff Name',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.stored_password, 'UpdatedPassword456!');
  });

  it('Create an enquiry and convert it to an appointment with waiting status', async () => {
    const enqRes = await request(app)
      .post('/api/enquiries')
      .send({
        name: 'Sita Devi',
        phone: '9876543210',
        email: 'sita@example.com',
        subject: 'IVF Consultation Enquiry',
        message: 'Looking for initial fertility assessment and consultation.',
      });
    assert.equal(enqRes.status, 201);
    createdEnquiryId = enqRes.body.id;
    assert.ok(createdEnquiryId);

    // Convert enquiry to appointment
    const convRes = await request(app)
      .post(`/api/enquiries/${createdEnquiryId}/convert-to-appointment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        appointment_date: '2026-10-15',
        appointment_time: '11:00 AM',
        notes: 'Converted from web enquiry',
      });
    assert.equal(convRes.status, 201);
    assert.ok(convRes.body.appointmentId);

    // Verify appointment details and initial status
    const apptRes = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(apptRes.status, 200);
    const appt = apptRes.body.appointments.find(a => a.id === convRes.body.appointmentId);
    assert.ok(appt);
    assert.equal(appt.patient_name, 'Sita Devi');
    assert.equal(appt.status, 'waiting');
  });

  it('Update appointment status to consulted and back to waiting', async () => {
    const listRes = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    const appt = listRes.body.appointments[0];
    assert.ok(appt);

    // Set to consulted
    const res1 = await request(app)
      .put(`/api/appointments/${appt.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'consulted' });
    assert.equal(res1.status, 200);

    // Set back to waiting
    const res2 = await request(app)
      .put(`/api/appointments/${appt.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'waiting' });
    assert.equal(res2.status, 200);
  });

  it('Update Treatment step-by-step description and verify persistence', async () => {
    const treatList = await request(app).get('/api/treatments');
    assert.equal(treatList.status, 200);
    assert.ok(treatList.body.treatments.length > 0);
    const treat = treatList.body.treatments[0];

    const updatedHtml = '<ol><li><strong>Initial Clinical Assessment:</strong> Comprehensive hormonal & ultrasound evaluation</li><li><strong>Ovarian Stimulation:</strong> Monitored protocol tailored to ovarian reserve</li><li><strong>Egg Retrieval:</strong> Ultrasound-guided painless procedure</li><li><strong>Embryo Transfer:</strong> Single blastocyst ultrasound guided transfer</li></ol>';

    const updateRes = await request(app)
      .put(`/api/treatments/${treat.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: treat.name,
        how_it_works: updatedHtml,
      });
    assert.equal(updateRes.status, 200);

    // Re-fetch detail by slug
    const detailRes = await request(app).get(`/api/treatments/${treat.slug}`);
    assert.equal(detailRes.status, 200);
    assert.ok(detailRes.body.treatment.how_it_works);
    const howItWorks = typeof detailRes.body.treatment.how_it_works === 'string'
      ? detailRes.body.treatment.how_it_works
      : JSON.stringify(detailRes.body.treatment.how_it_works);
    assert.ok(howItWorks.includes('Initial Clinical Assessment'));
    assert.ok(howItWorks.includes('Embryo Transfer'));
  });

  it('Clean up test staff account', async () => {
    if (testStaffId) {
      const delRes = await request(app)
        .delete(`/api/auth/users/${testStaffId}`)
        .set('Authorization', `Bearer ${superadminToken}`);
      assert.equal(delRes.status, 200);
    }
  });

  after(async () => {
    await pool.end();
  });
});

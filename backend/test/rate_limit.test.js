const { test, describe, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Abuse protection', () => {
  test('repeated failed sign-ins are rate limited', async () => {
    let lastResponse = null;

    for (let attempt = 0; attempt < 11; attempt += 1) {
      lastResponse = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: `wrong-password-${attempt}` });
    }

    assert.ok(lastResponse);
    assert.strictEqual(lastResponse.status, 429);
    assert.strictEqual(lastResponse.body.code, 'RATE_LIMITED');
    assert.ok(lastResponse.headers['retry-after']);
  });

  after(async () => {
    await pool.end();
  });
});

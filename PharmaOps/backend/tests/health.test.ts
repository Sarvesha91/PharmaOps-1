const request = require('supertest');

const { createApp } = require('../src/app');

describe('health endpoint', () => {
  it('returns ok', async () => {
    process.env.NODE_ENV = 'test';
    const app = await createApp();
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});


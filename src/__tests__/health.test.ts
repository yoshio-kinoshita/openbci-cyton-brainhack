import request from 'supertest';

import { createApp } from '../app';

const app = createApp();

describe('health endpoint', () => {
  it('responds with ok status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('analysis alpha endpoint', () => {
  it('accepts alpha analysis requests', async () => {
    const response = await request(app).post('/api/analysis/alpha');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'queued',
      message: 'アルファ波の解析ジョブを受け付けました。しばらくお待ちください。',
    });
  });
});

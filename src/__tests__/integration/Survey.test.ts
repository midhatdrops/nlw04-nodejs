import request from 'supertest';
import { app } from '../../app';

import createConnection from '../../database/index';

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    // await connection.runMigrations();
  });

  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Survey Example',
      description: 'Just an example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should get surveys', async () => {
    const response = await request(app).get('/surveys');

    expect(response.body).toHaveLength(1);
  });
});

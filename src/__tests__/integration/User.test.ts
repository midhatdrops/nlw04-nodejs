import request from 'supertest';
import { app } from '../../app';

import createConnection from '../../database/index';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'userexample@email.com',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user with an existing email', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'userexample@email.com',
    });

    expect(response.status).toBe(400);
  });
});
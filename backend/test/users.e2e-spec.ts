import { INestApplication } from '@nestjs/common';
import { initTestApp, generateTestTokens, removeTimestamps } from './utils';
import * as request from 'supertest';

describe('Users module (e2e)', () => {
  let app: INestApplication;

  const { adminToken, userToken } = generateTestTokens();

  beforeAll(async () => {
    app = await initTestApp();
  });
  it('/users (GET) without autenthication to return Unauthorized ', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });
  it('/users (GET) with autenthication but not authorized to return Forbidden', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/users (GET) with autenthication and authorized to return users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const usersWithoutTimestamps = removeTimestamps(response.body);
        expect(usersWithoutTimestamps).toEqual([
          {
            githubId: '12345',
            username: 'testuser',
            email: 'testuser@test.com',
            roles: ['user'],
            hasAcceptedTerms: false,
            avatarUrl: null,
          },
          {
            githubId: '67890',
            username: 'adminuser',
            email: 'admin@test.com',
            roles: ['admin'],
            hasAcceptedTerms: false,
            avatarUrl: null,
          },
        ]);
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });
});

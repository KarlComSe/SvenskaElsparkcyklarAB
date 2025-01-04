import { INestApplication } from '@nestjs/common';
import { initTestApp } from './utils';
import * as request from 'supertest';
import { User } from 'src/users/entities/user.entity';

describe('Auth module (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let fakeUserToken: string;
  let adminUser: User;
  let standardUser: User;
  let fakeUser: User;

  beforeAll(async () => {
    const { app: initializedApp, tokens } = await initTestApp();
    app = initializedApp;
    adminToken = tokens.adminToken;
    userToken = tokens.userToken;
    fakeUserToken = tokens.fakeUserToken;
    adminUser = tokens.adminUser;
    standardUser = tokens.standardUser;
    fakeUser = tokens.fakeUser;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/github', () => {
    it('should exchange GitHub code and return access token with user data', () => {
      const githubCode = 'validGithubCode123';

      return request(app.getHttpServer())
        .post('/v1/auth/github')
        .send({ code: githubCode })
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body.user).toHaveProperty('githubId');
          expect(response.body.user).toHaveProperty('username');
          expect(response.body.user).toHaveProperty('email');
          expect(response.body.user.roles).toContain('user');
        });
    });

    it('should handle invalid GitHub code', () => {
      const invalidCode = 'invalidCode';

      return request(app.getHttpServer())
        .post('/v1/auth/github')
        .send({ code: invalidCode })
        .expect(400)
        .then(response => {
          expect(response.body.message).toContain('Invalid GitHub code');
        });
    });
  });

  describe('GET /auth/status', () => {
    it('should return authenticated user status', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/status')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.isAuthenticated).toBe(true);
          expect(response.body.user).toHaveProperty('githubId', standardUser.githubId);
          expect(response.body.user).toHaveProperty('username', standardUser.username);
          expect(response.body.user).toHaveProperty('email', standardUser.email);
        });
    });

    it('should return unauthorized for invalid token', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/status')
        .set('Authorization', `Bearer invalidToken`)
        .expect(401);
    });

    it('should return unauthorized for missing token', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/status')
        .expect(401);
    });
  });

  describe('GET /auth/validate/:githubId', () => {
    it('should return user data for a valid GitHub ID', () => {
      return request(app.getHttpServer())
        .get(`/v1/auth/validate/${adminUser.githubId}`)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('githubId', adminUser.githubId);
          expect(response.body).toHaveProperty('username', adminUser.username);
        });
    });

    it('should return null for a non-existent GitHub ID', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/validate/nonexistentGithubId')
        .expect(200)
        .then(response => {
          expect(response.body).toBeNull();
        });
    });
  });
});

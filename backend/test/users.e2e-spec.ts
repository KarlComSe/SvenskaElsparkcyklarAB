import { INestApplication } from '@nestjs/common';
import { initTestApp } from './utils';
import * as request from 'supertest';
import { User } from 'src/users/entities/user.entity';

describe('Users Module Integration', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let adminUser: User;
  let standardUser: User;
  let fakeUserToken: string;

  beforeAll(async () => {
    const { app: initializedApp, tokens } = await initTestApp();
    app = initializedApp;
    adminToken = tokens.adminToken;
    userToken = tokens.userToken;
    adminUser = tokens.adminUser;
    standardUser = tokens.standardUser;
    fakeUserToken = tokens.fakeUserToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Payment Management', () => {
    it('should allow checking account balance and payment mode', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${standardUser.githubId}/account`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('accumulatedCost');
      expect(response.body).toHaveProperty('isMonthlyPayment');
    });

    it('should allow users to add funds to their account', async () => {
      const initialBalance = 100;
      await request(app.getHttpServer())
        .patch(`/v1/users/${standardUser.githubId}/adjust-funds`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ balance: initialBalance })
        .expect(200);

      // Verify the new balance
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${standardUser.githubId}/account`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.balance).toBe(initialBalance);
    });

    it('should allow switching between payment methods', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/users/${standardUser.githubId}/adjust-funds`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ isMonthlyPayment: true })
        .expect(200);

      const response = await request(app.getHttpServer())
        .get(`/v1/users/${standardUser.githubId}/account`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.isMonthlyPayment).toBe(true);
    });

    it('should not allow update of non-existent users', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/users/fakeuser/adjust-funds`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ balance: 1000 })
        .expect(404);
    });

    describe('Terms Management', () => {
      it('should track terms acceptance status', async () => {
        await request(app.getHttpServer())
          .patch('/v1/users/terms')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ hasAcceptedTerms: true })
          .expect(200)
          .expect((res) => {
            expect(res.body.hasAcceptedTerms).toBe(true);
          });
      });

      it('should reject invalid terms acceptance data', async () => {
        await request(app.getHttpServer())
          .patch('/v1/users/terms')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ hasAcceptedTerms: 'invalid' })
          .expect(400);
      });

      it('should reject terms update for invalid users', async () => {
        await request(app.getHttpServer())
          .patch('/v1/users/terms')
          .set('Authorization', `Bearer ${fakeUserToken}`)
          .send({ hasAcceptedTerms: true })
          .expect(401);
      });
    });

    describe('Admin Operations', () => {
      it('should allow admins to view all users', async () => {
        const response = await request(app.getHttpServer())
          .get('/v1/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('githubId');
        expect(response.body[0]).toHaveProperty('roles');
      });

      it('should allow admins to manage user roles', async () => {
        await request(app.getHttpServer())
          .patch(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            roles: ['user', 'support'],
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.roles).toContain('user');
            expect(res.body.roles).toContain('support');
          });
      });

      it('should allow admins to adjust any user funds', async () => {
        const newBalance = 500;
        await request(app.getHttpServer())
          .patch(`/v1/users/${standardUser.githubId}/adjust-funds`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ balance: newBalance })
          .expect(200)
          .expect((res) => {
            expect(res.body.balance).toBe(newBalance);
          });
      });

      it('should allow admins to get account details for any user', async () => {
        const response = await request(app.getHttpServer())
          .get(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('balance');
        expect(response.body).toHaveProperty('accumulatedCost');
        expect(response.body).toHaveProperty('isMonthlyPayment');
      });

      it('should not find non-existent users', async () => {
        await request(app.getHttpServer())
          .get('/v1/users/fakeuser')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });

    describe('Security Boundaries', () => {
      it('should prevent users from accessing other accounts', async () => {
        await request(app.getHttpServer())
          .get(`/v1/users/${adminUser.githubId}/account`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('should prevent users from modifying other accounts', async () => {
        await request(app.getHttpServer())
          .patch(`/v1/users/${adminUser.githubId}/adjust-funds`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ balance: 1000 })
          .expect(403);
      });

      it('should prevent non-admins from accessing admin endpoints', async () => {
        await request(app.getHttpServer())
          .get('/v1/users')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);

        await request(app.getHttpServer())
          .patch(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ roles: ['admin'] })
          .expect(403);

        await request(app.getHttpServer())
          .get(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });

    describe('User Deletion', () => {
      it('should allow admins to soft delete a user', async () => {
        // First verify the user exists and is active
        const initialResponse = await request(app.getHttpServer())
          .get(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(initialResponse.body.roles).not.toContain('inactive');

        // Perform soft delete
        const deleteResponse = await request(app.getHttpServer())
          .patch(`/v1/users/${standardUser.githubId}/soft-delete`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(deleteResponse.body.roles).toEqual(['inactive']);

        // Verify the user is now marked as inactive
        const finalResponse = await request(app.getHttpServer())
          .get(`/v1/users/${standardUser.githubId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(finalResponse.body.roles).toEqual(['inactive']);
      });

      it('should return 404 when trying to soft delete non-existent user', async () => {
        await request(app.getHttpServer())
          .patch('/v1/users/nonexistentuser/soft-delete')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });

      it('should prevent soft-deleted users from accessing protected routes', async () => {
        // First soft delete the user
        await request(app.getHttpServer())
          .patch(`/v1/users/${standardUser.githubId}/soft-delete`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        // Try to access a protected route
        await request(app.getHttpServer())
          .get(`/v1/users/${standardUser.githubId}/account`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(401);
      });
    });
  });
});

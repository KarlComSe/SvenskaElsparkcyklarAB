import { INestApplication } from '@nestjs/common';
import { initTestApp } from './utils';
import * as request from 'supertest';
import { User } from '../src/users/entities/user.entity';

describe('Travel module (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let standardUser: User;
  let testBikeId: string;
  let testTravelId: number;

  beforeAll(async () => {
    const { app: initializedApp, tokens } = await initTestApp();
    app = initializedApp;
    adminToken = tokens.adminToken;
    userToken = tokens.userToken;
    standardUser = tokens.standardUser;

    // Create a test bike first
    const bikeResponse = await request(app.getHttpServer())
      .post('/v1/bike/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Available',
        latitude: 57.70887,
        longitude: 11.97456,
        batteryLevel: 100,
      });

    testBikeId = bikeResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Basic Travel Operations', () => {
    it('should return all travels (empty at first)', () => {
      return request(app.getHttpServer())
        .get('/v1/rental')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    it('should return 404 for non-existent travel ID', () => {
      return request(app.getHttpServer()).get('/v1/rental/99999').expect(404);
    });
  });

  describe('Single Rental Flow', () => {
    it('should fail to start rental without auth token', () => {
      return request(app.getHttpServer()).post(`/v1/rental/bike/${testBikeId}`).expect(401);
    });

    it('should start renting a bike', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/rental/bike/${testBikeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('startTime');
      expect(response.body.customer.githubId).toBe(standardUser.githubId);

      testTravelId = response.body.id;
    });

    it('should get active travel for the bike', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/rental/bike/${testBikeId}/active`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('startTime');
      expect(response.body.stopTime).toBeNull();
    });

    it('should show travel in customer travels list', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/rental/customer/${standardUser.githubId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      const activeTravel = response.body.find((travel) => travel.id === testTravelId);
      expect(activeTravel).toBeTruthy();
      expect(activeTravel.customer.githubId).toBe(standardUser.githubId);
    });

    it('should end active travel for the bike', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/rental/bike/${testBikeId}/end-active`)
        .expect(201);

      expect(response.body).toHaveProperty('stopTime');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('Multiple Rentals', () => {
    let secondBikeId: string;

    beforeAll(async () => {
      const bikeResponse = await request(app.getHttpServer())
        .post('/v1/bike/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Available',
          latitude: 57.7,
          longitude: 11.97,
          batteryLevel: 100,
        });

      secondBikeId = bikeResponse.body.id;
    });

    beforeEach(async () => {
      // Reset bikes to Available status before each test
      await request(app.getHttpServer())
        .patch(`/v1/bike/${testBikeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Available' });

      await request(app.getHttpServer())
        .patch(`/v1/bike/${secondBikeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Available' });
    });

    it('should handle ending all travels for a customer', async () => {
      // Start rentals for both bikes
      await request(app.getHttpServer())
        .post(`/v1/rental/bike/${testBikeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/v1/rental/bike/${secondBikeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      // End all travels for the user
      const endAllResponse = await request(app.getHttpServer())
        .post(`/v1/rental/${standardUser.githubId}/end-all-travels`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      expect(typeof endAllResponse.body).toBe('object');
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when ending travel for non-existent bike', () => {
      return request(app.getHttpServer())
        .post('/v1/rental/bike/non-existent-bike/end-active')
        .expect(404);
    });

    it('should return 404 when getting active travel for non-existent bike', () => {
      return request(app.getHttpServer())
        .get('/v1/rental/bike/non-existent-bike/active')
        .expect(404);
    });

    it('should return 404 when customer has no active travels', () => {
      return request(app.getHttpServer())
        .post(`/v1/rental/${standardUser.githubId}/end-all-travels`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});

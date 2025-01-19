import { INestApplication } from '@nestjs/common';
import { initTestApp } from './utils';
import * as request from 'supertest';
import { CityName } from '../src/cities/types/city.enum';

describe('Bicycles module (e2e)', () => {
  describe('Bicycles Module Integration', () => {
    let app: INestApplication;
    const BIKE_STATUS_AVAILABLE = 'Available';
    const BASE_API_PATH = '/v1/bike';

    beforeAll(async () => {
      const { app: initializedApp } = await initTestApp();
      app = initializedApp;
    });

    afterAll(async () => {
      await app.close();
    });

    describe('GET /bike', () => {
      it('should return all bicycles without filters', () => {
        return request(app.getHttpServer())
          .get(BASE_API_PATH)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            if (response.body.length > 0) {
              const bike = response.body[0];
              expect(bike).toHaveProperty('id');
              expect(bike).toHaveProperty('batteryLevel');
              expect(bike).toHaveProperty('status');
              expect(bike).toHaveProperty('city');
            }
          });
      });

      it('should filter bicycles by city', () => {
        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}?city=${CityName.Göteborg}`)
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            if (response.body.length > 0) {
              expect(response.body[0].city).toBe(CityName.Göteborg);
            }
          });
      });

      it('should filter by location and radius', () => {
        const lat = 57.7095;
        const lon = 11.9689;
        const radius = 3000;

        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}?lat=${lat}&lon=${lon}&radius=${radius}`)
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
          });
      });

      it('should handle invalid location parameters', () => {
        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}?lat=57.7095`)
          .expect(400)
          .then((response) => {
            expect(response.body.message).toContain('Both lat and lon must be provided');
          });
      });
    });

    describe('POST /bike/create', () => {
      it('should create a new bicycle', () => {
        const newBicycle = {
          batteryLevel: 90,
          latitude: 57.12345,
          longitude: 12.54321,
          city: CityName.Göteborg,
          status: BIKE_STATUS_AVAILABLE,
        };

        return request(app.getHttpServer())
          .post(`${BASE_API_PATH}/create`)
          .send(newBicycle)
          .expect(201)
          .then((response) => {
            expect(response.body).toHaveProperty('id');
            expect(response.body.batteryLevel).toBe(newBicycle.batteryLevel);
            expect(response.body.latitude).toBe(newBicycle.latitude);
            expect(response.body.longitude).toBe(newBicycle.longitude);
            expect(response.body.status).toBe(newBicycle.status);
          });
      });
    });

    describe('GET /bike/:bikeId', () => {
      let testBikeId: string;

      beforeAll(async () => {
        const response = await request(app.getHttpServer()).post(`${BASE_API_PATH}/create`).send({
          batteryLevel: 80,
          latitude: 57.70887,
          longitude: 11.97456,
          city: CityName.Göteborg,
          status: BIKE_STATUS_AVAILABLE,
        });
        testBikeId = response.body.id;
      });

      it('should return a specific bicycle by ID', () => {
        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}/${testBikeId}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveProperty('id', testBikeId);
            expect(response.body).toHaveProperty('batteryLevel');
            expect(response.body).toHaveProperty('status');
          });
      });

      it('should handle non-existent bicycle ID', () => {
        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}/99999999-9999-9999-9999-999999999999`)
          .expect(404);
      });
    });

    describe('PATCH /bike/:bikeId', () => {
      let testBikeId: string;

      beforeAll(async () => {
        const response = await request(app.getHttpServer()).post(`${BASE_API_PATH}/create`).send({
          batteryLevel: 80,
          latitude: 57.70887,
          longitude: 11.97456,
          city: CityName.Göteborg,
          status: BIKE_STATUS_AVAILABLE,
        });
        testBikeId = response.body.id;
      });

      it('should update a bicycle', () => {
        const updateData = {
          batteryLevel: 95,
          status: BIKE_STATUS_AVAILABLE,
        };

        return request(app.getHttpServer())
          .patch(`${BASE_API_PATH}/${testBikeId}`)
          .send(updateData)
          .expect(200)
          .then((response) => {
            expect(response.body.batteryLevel).toBe(updateData.batteryLevel);
            expect(response.body.status).toBe(updateData.status);
          });
      });
    });

    describe('GET /bike/city/:cityName', () => {
      it('should return bicycles for a specific city', () => {
        return request(app.getHttpServer())
          .get(`${BASE_API_PATH}/city/${CityName.Göteborg}`)
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            if (response.body.length > 0) {
              expect(response.body[0].city.name).toBe(CityName.Göteborg);
            }
          });
      });
    });

    describe('POST /bike/create-many', () => {
      it('should create multiple bicycles', () => {
        const newBicycles = [
          {
            batteryLevel: 80,
            latitude: 57.70887,
            longitude: 11.97456,
            city: CityName.Göteborg,
            status: BIKE_STATUS_AVAILABLE,
          },
          {
            batteryLevel: 60,
            latitude: 58.40887,
            longitude: 11.78456,
            city: CityName.Karlshamn,
            status: BIKE_STATUS_AVAILABLE,
          },
          {
            batteryLevel: 90,
            latitude: 59.20887,
            longitude: 12.88456,
            city: CityName.Jönköping,
            status: BIKE_STATUS_AVAILABLE,
          },
        ];

        return request(app.getHttpServer())
          .post(`${BASE_API_PATH}/create-many`)
          .send(newBicycles)
          .expect(201)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(newBicycles.length);

            response.body.forEach((bike: any, index: number) => {
              expect(bike).toHaveProperty('id');
              expect(bike.batteryLevel).toBe(newBicycles[index].batteryLevel);
              expect(bike.latitude).toBe(newBicycles[index].latitude);
              expect(bike.longitude).toBe(newBicycles[index].longitude);
              expect(bike.status).toBe(newBicycles[index].status);
              expect(bike.city.name).toBe(newBicycles[index].city);
            });
          });
      });

      it('should return 400 if the request body is empty', () => {
        return request(app.getHttpServer())
          .post(`${BASE_API_PATH}/create-many`)
          .send([])
          .expect(400)
          .then((response) => {
            expect(response.body.message).toContain('At least one bike is required');
          });
      });
    });

    describe('PATCH /v1/bike/batch/positions', () => {
      let testBike: any;

      beforeAll(async () => {
        const newBike = {
          batteryLevel: 80,
          latitude: 57.70887,
          longitude: 11.97456,
          city: CityName.Göteborg,
          status: BIKE_STATUS_AVAILABLE,
        };

        const response = await request(app.getHttpServer())
          .post(`${BASE_API_PATH}/create`)
          .send(newBike)
          .expect(201);

        testBike = response.body;
      });

      it('should successfully update bike position and return success response', async () => {
        const updatedLatitude = 57.71;
        const updatedLongitude = 11.98;

        const requestBody = {
          updates: [
            {
              id: testBike.id,
              latitude: updatedLatitude,
              longitude: updatedLongitude,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .patch(`${BASE_API_PATH}/batch/positions`)
          .send(requestBody)
          .expect(200);

        expect(response.body).toEqual({
          results: [
            {
              id: testBike.id,
              success: true,
            },
          ],
          totalCount: 1,
          successCount: 1,
          failureCount: 0,
        });

        const updatedBike = await request(app.getHttpServer())
          .get(`${BASE_API_PATH}/${testBike.id}`)
          .expect(200);

        expect(updatedBike.body.latitude).toBe(updatedLatitude);
        expect(updatedBike.body.longitude).toBe(updatedLongitude);
      });
    });
  });
});

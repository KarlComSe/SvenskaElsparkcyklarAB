import { INestApplication } from '@nestjs/common';
import { initTestApp, generateTestTokens } from './utils';
import * as request from 'supertest';
import { CityName } from '../src/cities/types/city.enum';

describe('Zones module (e2e)', () => {
    let app: INestApplication;
    // const { adminToken, userToken } = generateTestTokens();

    beforeAll(async () => {
        app = await initTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /zone', () => {
        it('should return all zones without filters', () => {
            const response = request(app.getHttpServer())
                .get('/v1/zone')
                .expect('Content-Type', /json/)
                .expect(200);

            // console.log(response);

            return response
                .then(response => {
                    expect(Array.isArray(response.body.zones)).toBeTruthy();
                    // Verify zone structure
                    if (response.body.zones.length > 0) {
                        const zone = response.body.zones[0];
                        expect(zone).toHaveProperty('id');
                        expect(zone).toHaveProperty('polygon');
                        expect(zone).toHaveProperty('type');
                        expect(zone).toHaveProperty('city');
                    }
                });
        });

        it('should filter zones by type', () => {
            return request(app.getHttpServer())
                .get('/v1/zone?type=parking')
                .expect(200)
                .then(response => {
                    expect(response.body.zones.every(zone => zone.type === 'parking')).toBeTruthy();
                });
        });

        it('should filter zones by city', () => {
            return request(app.getHttpServer())
                .get(`/v1/zone?city=${CityName.Göteborg}`)
                .expect(200)
                .then(response => {
                    // console.log(response.body);
                    expect(response.body.zones.every(zone => zone.city.name === CityName.Göteborg)).toBeTruthy();
                });
        });

        it('should include bikes when requested', () => {
            return request(app.getHttpServer())
                .get('/v1/zone?includes=bikes')
                .expect(200)
                .then(response => {
                    if (response.body.zones.length > 0) {
                        // console.log(response.body.zones);
                        expect(response.body.zones[0]).toHaveProperty('bikes');
                    }
                });
        });

        it('should filter by location and radius', () => {
            const lat = 57.7095;
            const lon = 11.9689;
            const rad = 50; 

            return request(app.getHttpServer())
                .get(`/v1/zone?lat=${lat}&lon=${lon}&rad=${rad}`)
                .expect(200)
                .then(response => {
                    expect(response.body.zones).toHaveLength(1);
                });
        });

        it('should handle invalid filter values', () => {
            return request(app.getHttpServer())
                .get('/v1/zone?type=invalid_type')
                .expect(400)
                .then(response => {
                    expect(response.body.message[0]).toContain('type must be one of');
                });
        });
    });

    describe('GET /zone/city/:cityName', () => {
        // No authentication is required for this endpoint
        // it('should require authentication', () => {
        //     return request(app.getHttpServer())
        //         .get(`/v1/zone/city/${CityName.Göteborg}`)
        //         .expect(401);
        // });

        // it('should return zones for a specific city when authenticated', () => {
        //     return request(app.getHttpServer())
        //         .get(`/v1/zone/city/${CityName.Göteborg}`)
        //         .set('Authorization', `Bearer ${userToken}`)
        //         .expect(200)
        //         .then(response => {
        //             expect(Array.isArray(response.body)).toBeTruthy();
        //             if (response.body.length > 0) {
        //                 expect(response.body[0].city.name).toBe(CityName.Göteborg);
        //             }
        //         });
        // });

        it('should handle invalid city names', () => {
            return request(app.getHttpServer())
            .get('/v1/zone/city/InvalidCity')
            // .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual([]);
            });
        });
    });
});
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestApp } from './utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initTestApp();
  });

  afterAll(async () => {
    const userRepo = app.get('UserRepository');
    await userRepo.clear();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  // swagger documentation isn't enabled / built with the testapp, therefore this wont work.
  // it('/api (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/api')
  //     .expect(200)
  //     .expect('Content-Type', /html/);
  // });
});

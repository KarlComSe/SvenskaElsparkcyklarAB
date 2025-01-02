import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestApp } from './utils';
import { User } from 'src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let adminUser: User;
  let standardUser: User;
  let fakeUserToken: string;
  let fakeUser: User;

  beforeAll(async () => {
    const { app: initializedApp, tokens } = await initTestApp();
    app = initializedApp;
    adminToken = tokens.adminToken;
    userToken = tokens.userToken;
    adminUser = tokens.adminUser;
    standardUser = tokens.standardUser;
    fakeUserToken = tokens.fakeUserToken;
    fakeUser = tokens.fakeUser;
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

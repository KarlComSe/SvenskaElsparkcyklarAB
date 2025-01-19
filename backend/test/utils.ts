import { CanActivate, ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import ZoneSeeder from 'src/database/seeds/zones-data.seed';
import BicycleSeeder from 'src/database/seeds/bicycles-data.seed';
import UserDataSeeder from 'src/database/seeds/user-data.seed';
import TravelDataSeeder from 'src/database/seeds/travel-data.seed';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

// is guarded is a copy from stackoverflow / stackexchange
/**
 * Checks whether a route or a Controller is protected with the specified Guard.
 * @param route is the route or Controller to be checked for the Guard.
 * @param guardType is the type of the Guard, e.g. JwtAuthGuard.
 * @returns true if the specified Guard is applied.
 */
function isGuarded(
  route: ((...args: any[]) => any) | (new (...args: any[]) => unknown),
  guardType: new (...args: any[]) => CanActivate,
) {
  const guards: any[] = Reflect.getMetadata('__guards__', route);

  if (!guards) {
    throw Error(
      `Expected: ${route.name} to be protected with ${guardType.name}\nReceived: No guard`,
    );
  }

  let foundGuard = false;
  const guardList: string[] = [];
  guards.forEach((guard) => {
    guardList.push(guard.name);
    // console.log(guard.name)
    if (guard.name === guardType.name) foundGuard = true;
  });

  if (!foundGuard) {
    throw Error(
      `Expected: ${route.name} to be protected with ${guardType.name}\nReceived: only ${guardList}`,
    );
  }
  return true;
}

async function generateTestTokens(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminUser = await userRepository.findOne({
    where: { username: 'Pbris' },
  });

  // Find a regular user from our seed data
  // From seed data we know 'bobsmith' is a regular user
  const standardUser = await userRepository.findOne({
    where: { username: 'bobsmith' },
  });

  const fakeUser: User = {
    ...standardUser,
    githubId: 'fakeuser',
    username: 'fakeuser',
  };

  if (!adminUser || !standardUser) {
    throw new Error('Test users not found in database. Ensure seeds have run.');
  }

  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'your-test-secret',
  });

  const adminToken = jwtService.sign({
    sub: adminUser.githubId,
    username: adminUser.username,
    email: adminUser.email,
    roles: adminUser.roles,
  });

  const userToken = jwtService.sign({
    sub: standardUser.githubId,
    username: standardUser.username,
    email: standardUser.email,
    roles: standardUser.roles,
  });

  const fakeUserToken = jwtService.sign({
    sub: fakeUser.githubId,
    username: fakeUser.username,
    email: fakeUser.email,
    roles: fakeUser.roles,
  });

  return {
    adminToken,
    userToken,
    adminUser,
    standardUser,
    fakeUserToken,
    fakeUser,
  };
}

async function initTestApp() {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.init();

  const dataSource = app.get(DataSource);
  const userSeeder = new UserDataSeeder();
  await userSeeder.run(dataSource);

  const zoneSeeder = new ZoneSeeder();
  await zoneSeeder.run(dataSource);

  const bicycleSeeder = new BicycleSeeder();
  await bicycleSeeder.run(dataSource);

  const travelSeeder = new TravelDataSeeder();
  await travelSeeder.run(dataSource);

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalEnv;

  const tokens = await generateTestTokens(dataSource);
  return { app, tokens };
}

function removeTimestamps(users: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return users.map(({ createdAt, updatedAt, ...rest }) => rest);
}

export { isGuarded, removeTimestamps, generateTestTokens, initTestApp };

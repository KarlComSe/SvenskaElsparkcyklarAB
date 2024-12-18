import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { AppModule } from './../src/app.module';

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

// sub: user.githubId,
// username: user.username,
// email: user.email,
// roles: user.roles
function generateToken(user: JwtPayload) {
  const secret = process.env.JWT_SECRET || 'your-test-secret';
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  const token = jwtService.sign(user);
  return token;
}

const adminUser = {
  sub: '67890',
  username: 'adminuser',
  email: 'admin@test.com',
  roles: ['admin'],
};
const standardUser = {
  sub: '12345',
  username: 'testuser',
  email: 'testuser@test.com',
  roles: ['user'],
};

function generateTestTokens() {
  const adminToken = generateToken(adminUser);
  const userToken = generateToken(standardUser);

  return {
    adminToken,
    userToken,
  };
}

async function initTestApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  // Initialize test data
  const userRepo = app.get('UserRepository');
  await userRepo.save([
    {
      githubId: '12345',
      username: 'testuser',
      email: 'testuser@test.com',
      roles: ['user'],
    },
    {
      githubId: '67890',
      username: 'adminuser',
      email: 'admin@test.com',
      roles: ['admin'],
    },
  ]);

  return app;
}

function removeTimestamps(users: any[]) {
  return users.map(({ createdAt, updatedAt, ...rest }) => rest);
}

export {
  isGuarded,
  generateToken,
  removeTimestamps,
  generateTestTokens,
  initTestApp,
};

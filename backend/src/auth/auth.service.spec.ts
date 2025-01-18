import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

// Constants to avoid string duplication
const TEST_CONSTANTS = {
  GITHUB_ID: 'github-123',
  GITHUB_ID_INACTIVE: 'github-456',
  GITHUB_ID_NEW: 'github-999',
  TEST_EMAIL: 'testuser@example.com',
  TEST_USERNAME: 'testuser',
  AVATAR_URL: 'http://avatar.example.com',
  MOCK_TOKEN: 'mock-token',
} as const;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockUsers: User[] = [
    {
      githubId: TEST_CONSTANTS.GITHUB_ID,
      username: TEST_CONSTANTS.TEST_USERNAME,
      email: TEST_CONSTANTS.TEST_EMAIL,
      roles: ['user'],
      hasAcceptedTerms: true,
    } as User,
    {
      githubId: TEST_CONSTANTS.GITHUB_ID_INACTIVE,
      username: 'inactiveuser',
      email: 'inactiveuser@example.com',
      roles: ['inactive'],
      hasAcceptedTerms: true,
    } as User,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation(({ where }) =>
                Promise.resolve(mockUsers.find((user) => user.githubId === where.githubId)),
              ),
            save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: '2' })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload) => `token-for-${payload.username}`),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest
              .fn()
              .mockReturnValue(of({ data: { access_token: TEST_CONSTANTS.MOCK_TOKEN } })),
            get: jest.fn().mockReturnValue(
              of({
                data: {
                  id: TEST_CONSTANTS.GITHUB_ID,
                  login: TEST_CONSTANTS.TEST_USERNAME,
                  email: TEST_CONSTANTS.TEST_EMAIL,
                  avatar_url: TEST_CONSTANTS.AVATAR_URL,
                },
              }),
            ),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'OAUTH_CLIENT_ID') return 'mock-client-id';
              if (key === 'OAUTH_CLIENT_SECRET') return 'mock-client-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('exchangeGithubCode', () => {
    it('should exchange code and return a token and user', async () => {
      const result = await service.exchangeGithubCode('valid-code');
      expect(result.access_token).toBe(`token-for-${TEST_CONSTANTS.TEST_USERNAME}`);
      expect(result.user).toEqual(mockUsers[0]);
    });

    it('should create a new user if not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await service.exchangeGithubCode('new-user-code');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          githubId: TEST_CONSTANTS.GITHUB_ID,
          username: TEST_CONSTANTS.TEST_USERNAME,
        }),
      );
      expect(result.access_token).toBe(`token-for-${TEST_CONSTANTS.TEST_USERNAME}`);
    });

    it('should throw an error if the user is inactive', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUsers[1]); // Simulate inactive user
      await expect(service.exchangeGithubCode('inactive-code')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('validateUserById', () => {
    it('should return a user if found', async () => {
      const user = await service.validateUserById(TEST_CONSTANTS.GITHUB_ID);
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const user = await service.validateUserById('nonexistent-id');
      expect(user).toBeNull();
    });

    it('should return null if the user is inactive', async () => {
      const user = await service.validateUserById(TEST_CONSTANTS.GITHUB_ID_INACTIVE);
      expect(user).toBeNull();
    });
  });

  describe('getStatus', () => {
    it('should return user status', async () => {
      const status = await service.getStatus(mockUsers[0]);
      expect(status).toEqual({
        isAuthenticated: true,
        user: mockUsers[0],
      });
    });
  });

  describe('private methods', () => {
    it('getGithubToken should return a token', async () => {
      const token = await service['getGithubToken']('valid-code');
      expect(token).toBe(TEST_CONSTANTS.MOCK_TOKEN);
    });

    it('getGithubUser should return a user', async () => {
      const githubUser = await service['getGithubUser'](TEST_CONSTANTS.MOCK_TOKEN);
      expect(githubUser).toEqual({
        id: TEST_CONSTANTS.GITHUB_ID,
        login: TEST_CONSTANTS.TEST_USERNAME,
        email: TEST_CONSTANTS.TEST_EMAIL,
        avatar_url: TEST_CONSTANTS.AVATAR_URL,
      });
    });

    it('findOrCreateUser should find an existing user', async () => {
      const user = await service['findOrCreateUser']({
        id: TEST_CONSTANTS.GITHUB_ID,
        login: TEST_CONSTANTS.TEST_USERNAME,
        email: TEST_CONSTANTS.TEST_EMAIL,
        avatar_url: TEST_CONSTANTS.AVATAR_URL,
      });
      expect(user).toEqual(mockUsers[0]);
    });

    it('findOrCreateUser should create a new user if not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const user = await service['findOrCreateUser']({
        id: TEST_CONSTANTS.GITHUB_ID_NEW,
        login: 'newuser',
        email: 'newuser@example.com',
        avatar_url: TEST_CONSTANTS.AVATAR_URL,
      });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          githubId: TEST_CONSTANTS.GITHUB_ID_NEW,
          username: 'newuser',
        }),
      );
      expect(user).toEqual(
        expect.objectContaining({
          githubId: TEST_CONSTANTS.GITHUB_ID_NEW,
          username: 'newuser',
          email: 'newuser@example.com',
          avatarUrl: TEST_CONSTANTS.AVATAR_URL,
          roles: ['user'],
        }),
      );
    });
  });
});

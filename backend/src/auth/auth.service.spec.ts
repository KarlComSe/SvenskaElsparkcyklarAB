import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockUsers: User[] = [
    {
      githubId: 'github-123',
      username: 'testuser',
      email: 'testuser@example.com',
      avatarUrl: 'http://avatar.example.com',
      roles: ['user'],
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
            findOne: jest.fn().mockImplementation(({ where }) =>
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
            post: jest.fn().mockReturnValue(of({ data: { access_token: 'mock-token' } })),
            get: jest.fn().mockReturnValue(of({ data: { id: 'github-123', login: 'testuser', email: 'testuser@example.com', avatar_url: 'http://avatar.example.com' } })),
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
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('exchangeGithubCode', () => {
    it('should exchange code and return a token and user', async () => {
      const result = await service.exchangeGithubCode('valid-code');
      expect(result.access_token).toBe('token-for-testuser');
      expect(result.user).toEqual({
        githubId: 'github-123',
        username: 'testuser',
        email: 'testuser@example.com',
        roles: ['user'],
        hasAcceptedTerms: true,
      });
    });

    it('should create a new user if not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // Simulate no user found
      const result = await service.exchangeGithubCode('new-user-code');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          githubId: 'github-123',
          username: 'testuser',
        }),
      );
      expect(result.access_token).toBe('token-for-testuser');
    });
  });

  describe('validateUserById', () => {
    it('should return a user if found', async () => {
      const user = await service.validateUserById('github-123');
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const user = await service.validateUserById('nonexistent-id');
      expect(user).toBeNull();
    });
  });

  describe('getStatus', () => {
    it('should return user status', async () => {
      const status = await service.getStatus(mockUsers[0]);
      expect(status).toEqual({
        isAuthenticated: true,
        user: {
          githubId: 'github-123',
          username: 'testuser',
          email: 'testuser@example.com',
          roles: ['user'],
          hasAcceptedTerms: true,
        },
      });
    });
  });

  describe('private methods', () => {
    it('getGithubToken should return a token', async () => {
      const token = await service['getGithubToken']('valid-code');
      expect(token).toBe('mock-token');
    });

    it('getGithubUser should return a user', async () => {
      const githubUser = await service['getGithubUser']('mock-token');
      expect(githubUser).toEqual({
        id: 'github-123',
        login: 'testuser',
        email: 'testuser@example.com',
        avatar_url: 'http://avatar.example.com',
      });
    });

    it('findOrCreateUser should find an existing user', async () => {
      const user = await service['findOrCreateUser']({
        id: 'github-123',
        login: 'testuser',
        email: 'testuser@example.com',
        avatar_url: 'http://avatar.example.com',
      });
      expect(user).toEqual(mockUsers[0]);
    });

    it('findOrCreateUser should create a new user if not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // Simulate no user found
      const user = await service['findOrCreateUser']({
        id: 'github-999',
        login: 'newuser',
        email: 'newuser@example.com',
        avatar_url: 'http://avatar.example.com',
      });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          githubId: 'github-999',
          username: 'newuser',
        }),
      );
    });
  });
});

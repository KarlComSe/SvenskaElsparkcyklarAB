import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const configServiceMock = {
    get: jest.fn((key: string) => {
      // console.log('ConfigService.get called with:', key);  // Debug log
      const config = {
        'OAUTH_CLIENT_ID': 'mock-client-id',
        'OAUTH_CLIENT_SECRET': 'mock-client-secret',
      };
      const value = config[key];
      // console.log('Returning value:', value);  // Debug log
      return value;
    }),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
            verify: jest.fn(),
          }
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          }
        },
        {
          provide: ConfigService,
          useValue: configServiceMock
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('exchangeGithubCode', () => {
    it('should exchange code for token and return user data', async () => {
      // Setup mocks
      const mockGithubToken = {
        access_token: 'github-token-123'
      };
      const mockGithubUser = {
        id: '123',
        login: 'testuser',
        email: 'test@example.com'
      };

      const mockResponsePost: AxiosResponse = {
        data: mockGithubToken,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      // Mock GitHub API responses
      jest.spyOn(httpService, 'post').mockImplementation(() =>
        of(mockResponsePost)
      );

      const mockResponseGet: AxiosResponse = {
        data: mockGithubUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        of(mockResponseGet)
      );

      // Mock user repository
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        githubId: '123',
        username: 'testuser',
        email: 'test@example.com'
      } as User);

      // Execute method
      const result = await service.exchangeGithubCode('test-code');

      // Verify results
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');

      // Verify our mocks were called correctly
      expect(httpService.post).toHaveBeenCalledWith(
        'https://github.com/login/oauth/access_token',
        {
          client_id: 'mock-client-id',
          client_secret: 'mock-client-secret',
          code: 'test-code'
        },
        { headers: { Accept: 'application/json' } }
      );

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `Bearer github-token-123`,
            Accept: 'application/json'
          }
        }
      );
    });
  });
});
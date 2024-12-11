import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock data
  const mockUser = {
    githubId: '123',
    username: 'testuser',
    email: 'test@example.com',
    roles: ['user'],
    hasAcceptedTerms: false
  };

  const mockAuthResponse = {
    access_token: 'mock-jwt-token',
    user: mockUser
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            exchangeGithubCode: jest.fn().mockResolvedValue(mockAuthResponse),
            getStatus: jest.fn().mockResolvedValue({
              isAuthenticated: true,
              user: mockUser
            })
          }
        }
      ]
    })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('exchangeToken', () => {
    it('should exchange GitHub code for access token', async () => {
      const code = 'github-code-123';
      const result = await controller.exchangeToken({ code });

      expect(authService.exchangeGithubCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle invalid GitHub code', async () => {
      jest.spyOn(authService, 'exchangeGithubCode')
        .mockRejectedValue(new Error('Invalid code'));

      await expect(controller.exchangeToken({ code: 'invalid' }))
        .rejects.toThrow('Invalid code');
    });
  });

  describe('getMe', () => {
    it('should return user information for authenticated user', async () => {
      const req = { user: mockUser };
      const result = await controller.getMe(req);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getStatus', () => {
    it('should return authentication status for authenticated user', async () => {
      const req = { user: mockUser };
      const expectedStatus = {
        isAuthenticated: true,
        user: mockUser
      };

      const result = await controller.getStatus(req);
      expect(authService.getStatus).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedStatus);
    });
  });

  describe('Guard behavior', () => {
    it('me and status endpoints should have JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getMe);
      expect(guards).toContain(JwtAuthGuard);

      const statusGuards = Reflect.getMetadata('__guards__', controller.getStatus);
      expect(statusGuards).toContain(JwtAuthGuard);
    });

    it('token endpoint should have no guard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.exchangeToken);
      expect(guards).toBeUndefined();
    });
  });
});
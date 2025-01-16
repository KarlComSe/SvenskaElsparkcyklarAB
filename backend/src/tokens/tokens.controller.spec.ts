import { Test, TestingModule } from '@nestjs/testing';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenGuard } from './guards/token.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('TokensController', () => {
  let controller: TokensController;
  let tokensService: TokensService;

  const mockUser = {
    githubId: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    roles: ['user'],
    hasAcceptedTerms: true,
    avatarUrl: 'avatar.url',
    createdAt: new Date(),
    updatedAt: new Date(),
    isMonthlyPayment: true,
    accumulatedCost: 0,
    balance: 100
  };

  const mockToken = {
    id: 'token-1',
    customer: mockUser,
    customerId: 'user-1',
    remainingUses: 4,
    maxUses: 10,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    lastUsedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [
        {
          provide: TokensService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockToken),
            consume: jest.fn().mockResolvedValue({
              ...mockToken,
              remainingUses: mockToken.remainingUses - 1,
            }),
            findOne: jest.fn().mockResolvedValue(mockToken),
            revokeAllForUser: jest.fn().mockResolvedValue({ affected: 2 }),
          },
        },
      ],
    }).compile();

    controller = module.get<TokensController>(TokensController);
    tokensService = module.get<TokensService>(TokensService);
  });

  describe('token operations', () => {
    it('should create a new token', async () => {
      const req = { user: mockUser };
      const result = await controller.create(req);

      expect(tokensService.create).toHaveBeenCalledWith(mockUser.githubId);
      expect(result).toEqual({
        token: mockToken.id,
        remainingUses: mockToken.remainingUses,
        expiresAt: mockToken.expiresAt,
      });
    });

    it('should consume a token', async () => {
      const result = await controller.consume('token-1');

      expect(tokensService.consume).toHaveBeenCalledWith('token-1');
      expect(result).toEqual({
        token: mockToken.id,
        remainingUses: mockToken.remainingUses - 1,
        expiresAt: mockToken.expiresAt,
      });
    });

    it('should revoke all tokens for a user', async () => {
      const req = { user: mockUser };
      const result = await controller.revokeAllForUser(req);

      expect(tokensService.revokeAllForUser).toHaveBeenCalledWith(mockUser.githubId);
      expect(result).toEqual({
        success: true,
        message: 'All tokens have been revoked successfully',
        revokedCount: 2,
      });
    });
  });

  describe('findOne', () => {
    it('should return token information', async () => {
      const result = await controller.findOne('token-1');

      expect(tokensService.findOne).toHaveBeenCalledWith('token-1');
      expect(result).toEqual({
        token: mockToken.id,
        remainingUses: mockToken.remainingUses,
        expiresAt: mockToken.expiresAt,
      });
    });
  });

  describe('protected routes', () => {
    it('should return a message for protected route', async () => {
      const result = await controller.someProtectedRoute();
      expect(result.message).toContain('Access granted');
      expect(result.message).toContain('Here\'s a life insight for you:');
    });

    it('should verify guard presence on protected routes', () => {
      expect(Reflect.getMetadata('__guards__', controller.create))
        .toContain(JwtAuthGuard);
      expect(Reflect.getMetadata('__guards__', controller.someProtectedRoute))
        .toContain(TokenGuard);
    });
  });
});
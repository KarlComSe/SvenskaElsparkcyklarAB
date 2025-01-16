import { Test, TestingModule } from '@nestjs/testing';
import { TokensV2Controller } from './tokensv2.controller';
import { TokensService } from './tokens.service';

describe('TokensV2Controller', () => {
  let controller: TokensV2Controller;
  let tokensService: TokensService;

  // Mock data
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
      controllers: [TokensV2Controller],
      providers: [
        {
          provide: TokensService,
          useValue: {
            consume: jest.fn().mockResolvedValue({
              ...mockToken,
              remainingUses: mockToken.remainingUses - 1,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TokensV2Controller>(TokensV2Controller);
    tokensService = module.get<TokensService>(TokensService);
  });

  describe('consume', () => {
    let originalMathRandom: () => number;

    beforeEach(() => {
      // Store the original Math.random
      originalMathRandom = Math.random;
    });

    afterEach(() => {
      // Restore the original Math.random
      Math.random = originalMathRandom;
    });

    it('should consume a token and return a Roosevelt quote', async () => {
      // Mock Math.random to return a predictable value
      Math.random = jest.fn().mockReturnValue(0.1); // This will select the second quote

      const result = await controller.consume('token-1');

      expect(tokensService.consume).toHaveBeenCalledWith('token-1');
      expect(result).toEqual({
        token: mockToken.id,
        remainingUses: mockToken.remainingUses - 1,
        expiresAt: mockToken.expiresAt,
        message: expect.stringContaining('This is a v2 response: Here\'s a quote from Theodore Roosevelt:')
      });
      // Verify it includes a Roosevelt quote
      expect(result.message).toContain('Do what you can, with what you have, where you are');
    });
  });
});
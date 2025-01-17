import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity/token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('TokensService', () => {
  let service: TokensService;
  let repository: Repository<Token>;

  const mockUser: User = {
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
    balance: 100,
  };

  const mockTokens: Token[] = [
    {
      id: 'token-1',
      customer: mockUser,
      customerId: 'user-1',
      remainingUses: 4,
      maxUses: 10,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      createdAt: new Date(),
      lastUsedAt: new Date(),
    },
    {
      id: 'token-2',
      customer: mockUser,
      customerId: 'user-1',
      remainingUses: 0,
      maxUses: 10,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastUsedAt: new Date(),
    },
    {
      id: 'token-3',
      customer: mockUser,
      customerId: 'user-1',
      remainingUses: 10,
      maxUses: 10,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired token
      createdAt: new Date(),
      lastUsedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: getRepositoryToken(Token),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((token) =>
              Promise.resolve({
                id: 'new-token-id',
                lastUsedAt: new Date(),
                ...token,
              }),
            ),
            find: jest
              .fn()
              .mockImplementation(({ where }) =>
                Promise.resolve(
                  mockTokens.filter((token) => token.customerId === where.customerId),
                ),
              ),
            findOne: jest
              .fn()
              .mockImplementation(({ where }) =>
                Promise.resolve(mockTokens.find((token) => token.id === where.id)),
              ),
            delete: jest.fn().mockResolvedValue({ affected: 2 }),
          },
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    repository = module.get<Repository<Token>>(getRepositoryToken(Token));
  });

  describe('create', () => {
    it('should create a new token successfully', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      const result = await service.create('new-user');

      expect(result).toHaveProperty('id', 'new-token-id');
      expect(result.customerId).toBe('new-user');
      expect(result.remainingUses).toBe(10);
      expect(result.maxUses).toBe(10);
      expect(result).toHaveProperty('lastUsedAt');
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error when user has reached maximum tokens', async () => {
      const maxTokens = Array(5).fill({ remainingUses: 1 });
      jest.spyOn(repository, 'find').mockResolvedValueOnce(maxTokens);

      await expect(service.create('user-max-tokens')).rejects.toThrow(BadRequestException);
    });
  });

  describe('consume', () => {
    it('should consume a token successfully', async () => {
      // Create a copy of the mock token with exactly 4 remaining uses
      const token = {
        ...mockTokens[0],
        remainingUses: 4, // Set initial value to 4
      };
      const now = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(token);
      jest.spyOn(repository, 'save').mockImplementationOnce(
        async (savedToken) =>
          ({
            ...savedToken,
            lastUsedAt: now,
          }) as Token,
      );

      const result = await service.consume('token-1');

      expect(result.remainingUses).toBe(3); // Expect 4 - 1 = 3
      expect(result.lastUsedAt).toEqual(now);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: token.id,
          remainingUses: 3,
        }),
      );
    });

    it('should throw error when token not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.consume('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw error when token has no remaining uses', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockTokens[1]);

      await expect(service.consume('token-2')).rejects.toThrow(BadRequestException);
    });

    it('should throw error when token has expired', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockTokens[2]);

      await expect(service.consume('token-3')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a token when found', async () => {
      const result = await service.findOne('token-1');
      expect(result).toEqual(mockTokens[0]);
    });

    it('should throw error when token not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('revokeAllForUser', () => {
    it('should revoke all tokens for a user', async () => {
      const result = await service.revokeAllForUser('user-1');
      expect(result.affected).toBe(2);
      expect(repository.delete).toHaveBeenCalledWith({ customerId: 'user-1' });
    });
  });
});

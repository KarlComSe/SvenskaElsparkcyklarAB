import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from './token.guard';
import { TokensService } from '../tokens.service';
import { ExecutionContext } from '@nestjs/common';

describe('TokenGuard', () => {
  let guard: TokenGuard;
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGuard,
        {
          provide: TokensService,
          useValue: {
            consume: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<TokenGuard>(TokenGuard);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access with valid token', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-api-token': 'valid-token',
            },
          }),
        }),
      };

      jest.spyOn(tokensService, 'consume').mockResolvedValueOnce(null);

      const result = await guard.canActivate(context as ExecutionContext);
      expect(result).toBe(true);
      expect(tokensService.consume).toHaveBeenCalledWith('valid-token');
    });

    it('should throw UnauthorizedException when token is missing', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      };

      await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(tokensService.consume).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-api-token': 'invalid-token',
            },
          }),
        }),
      };

      jest.spyOn(tokensService, 'consume').mockRejectedValueOnce(new Error('Invalid token'));

      await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(tokensService.consume).toHaveBeenCalledWith('invalid-token');
    });
  });
});

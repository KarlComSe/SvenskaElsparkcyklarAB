import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { User } from './entities/user.entity';
import { BadRequestException, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isGuarded } from '../../test/utils';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Create mock user for reuse
  const mockUser: User = {
    githubId: '123',
    username: 'testuser',
    email: 'test@example.com',
    roles: [],
    hasAcceptedTerms: true,
    avatarUrl: 'https://example.com/avatar.png',
    updatedAt: new Date(),
    createdAt: new Date()
  };

  // Create mock request for reuse
  const mockRequest = { user: { githubId: '123' } };

  // Create mock updateTermsDto for reuse
  const updateTermsDto: UpdateTermsDto = { hasAcceptedTerms: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            updateTerms: jest.fn().mockResolvedValue(mockUser),
          }
        }
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Clear mock calls to ensure a fresh start for each test
    jest.resetModules(); // Reset module registry to avoid cached modules
  });

  describe('updateTerms', () => {
    it('should successfully update terms', async () => {
      const dto: UpdateTermsDto = { hasAcceptedTerms: true };
      await expect(controller.updateTerms(mockRequest, dto))
        .resolves.toEqual(mockUser);
    });

    it('should throw BadRequestException for invalid input', async () => {
      const invalidDto = { hasAcceptedTerms: null };
      await expect(controller.updateTerms(mockRequest, invalidDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should call usersService.updateTerms with correct parameters', async () => {
      const updateTermsSpy = jest.spyOn(usersService, 'updateTerms').mockResolvedValue({} as User);
      await controller.updateTerms(mockRequest, updateTermsDto);
      expect(updateTermsSpy).toHaveBeenCalledWith('123', true);
    });

    it('should return the result from usersService.updateTerms', async () => {
      jest.spyOn(usersService, 'updateTerms').mockResolvedValue(mockUser);
      const response = await controller.updateTerms(mockRequest, updateTermsDto);
      expect(response).toBe(mockUser);
    });

    it('should handle errors thrown by usersService.updateTerms', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(usersService, 'updateTerms').mockRejectedValue(error);
      await expect(controller.updateTerms(mockRequest, updateTermsDto)).rejects.toThrow(error);
    });

    it('should throw UnauthorizedException when not authenticated', async () => {
      const reflector = new Reflector();
      const guards = reflector.getAllAndOverride('guards', [
        UsersController.prototype.updateTerms,
      ]);

      console.log('Guards applied:', guards); // Debug: Check which guards are applied
    });

    it('should throw UnauthorizedException when not authenticated', async () => {

      const guardMock = {
        canActivate: jest.fn().mockImplementation(() => {
          console.log('Mock guard invoked'); // Debug: Check if guard is being called
          throw new UnauthorizedException();
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: {
              updateTerms: jest.fn().mockResolvedValue(mockUser),
            }
          }
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue(guardMock)
        .compile()

        console.log('Module:', module.get(UsersController));


      const reflector = new Reflector();
      const guards = reflector.getAllAndOverride('guards', [
        UsersController.prototype.updateTerms,
      ]);

      console.log('Guards applied:', guards); // Debug: Check which guards are applied

      const unauthorizedController = module.get<UsersController>(UsersController);

      expect(guardMock.canActivate).toHaveBeenCalled(); // Validate guard invocation
      await expect(unauthorizedController.updateTerms(mockRequest, updateTermsDto)).rejects.toThrow(UnauthorizedException);
    });

    it(`should be protected with JwtAuthGuard.`, async () => {
      expect(isGuarded(UsersController.prototype.updateTerms, JwtAuthGuard)).toBe(true)
    })

    it('should throw an error if updateTermsDto is invalid', async () => {
      const updateTermsDto: any = { hasAcceptedTerms: null };

      await expect(controller.updateTerms(mockRequest, updateTermsDto)).rejects.toThrow('Invalid input');
    });
  });
});

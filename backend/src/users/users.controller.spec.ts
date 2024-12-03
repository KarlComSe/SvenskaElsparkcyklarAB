import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { User } from './entities/user.entity';
import { BadRequestException, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: { updateTerms: jest.fn() }
          }
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => false })
        .compile();

      const unauthorizedController = module.get<UsersController>(UsersController);

      // This was tricky. We need to use try-catch to catch the error thrown by the guard.
      try {
        await unauthorizedController.updateTerms(mockRequest, updateTermsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should throw an error if updateTermsDto is invalid', async () => {
      const updateTermsDto: any = { hasAcceptedTerms: null };

      await expect(controller.updateTerms(mockRequest, updateTermsDto)).rejects.toThrow('Invalid input');
    });
  });
});

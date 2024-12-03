import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update terms acceptance', async () => {
    const mockUser = new User({ githubId: '123', hasAcceptedTerms: false });

    mockRepository.findOne.mockResolvedValue(mockUser);
    mockRepository.save.mockResolvedValue({ ...mockUser, hasAcceptedTerms: true });

    const result = await service.updateTerms('123', true);
    expect(result.hasAcceptedTerms).toBe(true);
  });
});
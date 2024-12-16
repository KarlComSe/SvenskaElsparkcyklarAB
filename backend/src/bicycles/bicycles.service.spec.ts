import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BicyclesService } from './bicycles.service';
import { Bicycle } from './entities/bicycle.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('BicyclesService', () => {
  let service: BicyclesService;
  let repository: Repository<Bicycle>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BicyclesService,
        {
          provide: getRepositoryToken(Bicycle),
          useValue: mockRepository
        }
      ],
    }).compile();

    service = module.get<BicyclesService>(BicyclesService);
    repository = module.get(getRepositoryToken(Bicycle));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    it('should throw NotFoundException when updating non-existent bicycle', async () => {
      const updateDto: UpdateBicycleDto = { 
        batteryLevel: 85,
        status: 'Service'
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
    });
  });
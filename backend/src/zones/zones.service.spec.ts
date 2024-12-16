import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone';
import { Repository } from 'typeorm';

const mockRepository = {
  find: jest.fn(),
};

describe('ZonesService', () => {
  let service: ZonesService;
  let repository: Repository<Zone>;

  const mockZone: Zone = {
    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
    polygon: [
      { lat: 59.3293, lng: 18.0686 },
      { lat: 59.3294, lng: 18.0687 }
    ],
    type: 'speed',
    speedZone: {
      id: 'c2f88dd4-0ba9-5f7c-b5d7-c7fc59f59465',
      speedLimit: 20.5,
      zone: null
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonesService,
        {
          provide: getRepositoryToken(Zone),
          useValue: mockRepository
        }
      ],
    }).compile();

    service = module.get<ZonesService>(ZonesService);
    repository = module.get(getRepositoryToken(Zone));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of zones', async () => {
      mockRepository.find.mockResolvedValue([mockZone]);

      const result = await service.findAll();
      
      expect(result).toEqual([mockZone]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['speedZone']
      });
    });

    it('should handle empty result from repository', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      
      expect(result).toEqual([]);
    });
  });
});
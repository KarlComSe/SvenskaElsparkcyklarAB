import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';
import { BadRequestException } from '@nestjs/common';
import { CityName } from '../cities/types/city.enum';
import { BatchUpdateBicyclePositionsDto } from './dto/batch-update.dto';

describe('BicyclesController', () => {
  let controller: BicyclesController;
  let service: BicyclesService;

  const mockBicycleResponse = [
    {
      id: '1',
      batteryLevel: 90,
      status: 'Available',
      latitude: 57.70887,
      longitude: 11.97456,
      city: CityName.Göteborg,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockBicyclesService = {
    findAll: jest.fn(() => Promise.resolve(mockBicycleResponse)),
    findByCity: jest.fn(() => Promise.resolve(mockBicycleResponse)),
    findByLocation: jest.fn(() => Promise.resolve(mockBicycleResponse)),
    findByCityAndLocation: jest.fn(() => Promise.resolve(mockBicycleResponse)),
    toBicycleResponses: jest.fn((bikes) => bikes),
    findById: jest.fn((id) => Promise.resolve(mockBicycleResponse[0])),
    createBike: jest.fn((dto) => Promise.resolve(mockBicycleResponse[0])),
    createManyBikes: jest.fn((dtos) => Promise.resolve(mockBicycleResponse)),
    update: jest.fn((id, dto) => Promise.resolve(mockBicycleResponse[0])),
    updatePositionsParallel: jest.fn(), // Add this mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicyclesController],
      providers: [
        {
          provide: BicyclesService,
          useValue: mockBicyclesService,
        },
      ],
    }).compile();

    controller = module.get<BicyclesController>(BicyclesController);
    service = module.get<BicyclesService>(BicyclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBicycles', () => {
    it('should return all bicycles', async () => {
      const result = await controller.getAllBicycles();
      expect(result).toEqual(mockBicycleResponse);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw BadRequestException if only latitude is provided', async () => {
      await expect(controller.getAllBicycles('57.70887')).rejects.toThrow(BadRequestException);
    });

    it('should return bicycles filtered by city', async () => {
      const result = await controller.getAllBicycles(
        undefined,
        undefined,
        undefined,
        CityName.Göteborg,
      );
      expect(result).toEqual(mockBicycleResponse);
      expect(service.findByCity).toHaveBeenCalledWith(CityName.Göteborg);
    });

    it('should return bicycles filtered by location', async () => {
      const result = await controller.getAllBicycles('57.70887', '11.97456');
      expect(result).toEqual(mockBicycleResponse);
      expect(service.findByLocation).toHaveBeenCalledWith(57.70887, 11.97456, 3000);
    });
  });

  describe('createABike', () => {
    it('should create a new bicycle', async () => {
      const dto = {
        batteryLevel: 80,
        latitude: 57.70887,
        longitude: 11.97456,
        city: CityName.Göteborg,
      };
      const result = await controller.createABike(dto);
      expect(result).toEqual(mockBicycleResponse[0]);
      expect(service.createBike).toHaveBeenCalledWith(dto);
    });
  });

  describe('getBikeById', () => {
    it('should return a bicycle by ID', async () => {
      const result = await controller.getBikeById('1');
      expect(result).toEqual(mockBicycleResponse[0]);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateBicycle', () => {
    it('should update a bicycle', async () => {
      const dto = { batteryLevel: 80 };
      const result = await controller.updateBicycle('1', dto);
      expect(result).toEqual(mockBicycleResponse[0]);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('updateBatchPositions', () => {
    it('should update multiple bicycle positions', async () => {
      const updateDto: BatchUpdateBicyclePositionsDto = {
        updates: [
          { id: '1', latitude: 57.70887, longitude: 11.97456 },
          { id: '2', latitude: 57.70888, longitude: 11.97457 }
        ]
      };

      const mockResults = [
        { id: '1', success: true },
        { id: '2', success: false, error: 'Bicycle not found' }
      ];

      mockBicyclesService.updatePositionsParallel.mockResolvedValue(mockResults);

      const result = await controller.updateBatchPositions(updateDto);

      expect(service.updatePositionsParallel).toHaveBeenCalledWith(updateDto.updates);
      expect(result).toEqual({
        results: mockResults,
        totalCount: 2,
        successCount: 1,
        failureCount: 1
      });
    });
  });
});

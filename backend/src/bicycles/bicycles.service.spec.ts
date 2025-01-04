import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesService } from './bicycles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { City } from '../cities/entities/city.entity';
import { CityName } from '../cities/types/city.enum';

describe('BicyclesService', () => {
  let service: BicyclesService;
  let bicycleRepository: Repository<Bicycle>;
  let cityRepository: Repository<City>;

  const mockBicycles = [
    {
      id: '1',
      batteryLevel: 80,
      latitude: 57.70887,
      longitude: 11.97456,
      status: 'Available',
      city: { name: CityName.Göteborg },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockCity = { name: CityName.Göteborg };

  const mockUpdateResult: UpdateResult = {
    affected: 1,
    generatedMaps: [],
    raw: {},
  };

  const mockBicycleRepository = {
    find: jest.fn().mockResolvedValue(mockBicycles),
    findOne: jest.fn().mockResolvedValue(mockBicycles[0]),
    create: jest.fn().mockImplementation((bicycle) => bicycle),
    save: jest.fn().mockResolvedValue(mockBicycles[0]),
    update: jest.fn().mockResolvedValue(mockUpdateResult),
  };

  const mockCityRepository = {
    findOne: jest.fn().mockResolvedValue(mockCity),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BicyclesService,
        {
          provide: getRepositoryToken(Bicycle),
          useValue: mockBicycleRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    service = module.get<BicyclesService>(BicyclesService);
    bicycleRepository = module.get<Repository<Bicycle>>(getRepositoryToken(Bicycle));
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all bicycles', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockBicycles);
      expect(bicycleRepository.find).toHaveBeenCalled();
    });
  });

  describe('setRented', () => {
    it('should set a bicycle to rented', async () => {
      const result = await service.setRented('1');
      expect(result).toEqual(mockBicycles[0]);
      expect(bicycleRepository.update).toHaveBeenCalledWith(
        { id: '1', status: 'Available' },
        { status: 'Rented' },
      );
    });

    it('should throw NotFoundException if no bicycle is updated', async () => {
      jest.spyOn(bicycleRepository, 'update').mockResolvedValueOnce({
        ...mockUpdateResult,
        affected: 0, // Simulate no affected rows
      });
      await expect(service.setRented('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBike', () => {
    it('should create a bicycle', async () => {
      const dto = {
        batteryLevel: 90,
        latitude: 57.70887,
        longitude: 11.97456,
        city: CityName.Göteborg,
      };
      const result = await service.createBike(dto);
      expect(result).toEqual(mockBicycles[0]);
      expect(bicycleRepository.create).toHaveBeenCalledWith({
        batteryLevel: 90,
        latitude: 57.70887,
        longitude: 11.97456,
        status: 'Available',
        city: mockCity,
      });
    });
  });
});

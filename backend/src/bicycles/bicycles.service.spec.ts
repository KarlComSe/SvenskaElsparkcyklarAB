import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesService } from './bicycles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { City } from '../cities/entities/city.entity';
import { CityName } from '../cities/types/city.enum';
import { BicyclePositionDto } from './dto/batch-update.dto';

jest.mock('../utils/geo.utils', () => ({
  getDistance: jest.fn(),
}));

describe('BicyclesService', () => {
  let service: BicyclesService;
  let bicycleRepository: Repository<Bicycle>;
  let cityRepository: Repository<City>;

  const mockCity = {
    id: '1',
    name: CityName.Göteborg,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBicycles = [
    {
      id: '1',
      batteryLevel: 80,
      latitude: 57.70887,
      longitude: 11.97456,
      status: 'Available' as const,
      city: mockCity,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockBicycleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult),
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

  describe('setRented', () => {
    it('should set a bicycle to rented', async () => {
      const bikeId = '1';

      jest.spyOn(service, 'findById').mockResolvedValue(mockBicycles[0]);

      const result = await service.setRented(bikeId);

      expect(result).toEqual(mockBicycles[0]);
      expect(bicycleRepository.update).toHaveBeenCalledWith(
        { id: bikeId, status: 'Available' },
        { status: 'Rented' },
      );
    });

    it('should throw NotFoundException if no bicycle is updated', async () => {
      const bikeId = '1';

      jest.spyOn(bicycleRepository, 'update').mockResolvedValueOnce({
        affected: 0,
      } as UpdateResult);

      await expect(service.setRented(bikeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCityAndLocation', () => {
    it('should return bicycles in the given city and within a specified radius', async () => {
      const cityName = CityName.Göteborg;
      const lat = 57.70887;
      const lon = 11.97456;
      const radius = 3000;

      const mockBicycles = [
        {
          id: '1',
          batteryLevel: 80,
          latitude: 57.70887,
          longitude: 11.97456,
          status: 'Available' as const,
          city: mockCity,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findByCity').mockResolvedValue(mockBicycles);
      const getDistanceMock = require('../utils/geo.utils').getDistance;
      getDistanceMock.mockImplementation((lat1, lon1, lat2, lon2) => 1000);

      const result = await service.findByCityAndLocation(cityName, lat, lon, radius);
      expect(result).toHaveLength(1);
      expect(result).toEqual(mockBicycles);
      expect(service.findByCity).toHaveBeenCalledWith(cityName);
    });

    it('should return an empty array if no bicycles match the criteria', async () => {
      const cityName = CityName.Göteborg;
      const lat = 57.70887;
      const lon = 11.97456;
      const radius = 3000;

      jest.spyOn(service, 'findByCity').mockResolvedValue([]);
      const getDistanceMock = require('../utils/geo.utils').getDistance;
      getDistanceMock.mockReset();

      const result = await service.findByCityAndLocation(cityName, lat, lon, radius);
      expect(result).toEqual([]);
      expect(service.findByCity).toHaveBeenCalledWith(cityName);
      expect(getDistanceMock).not.toHaveBeenCalled();
    });
  });
});

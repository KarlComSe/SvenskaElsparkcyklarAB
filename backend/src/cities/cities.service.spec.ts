import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityName } from './types/city.enum';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepository: Repository<City>;

  const mockCity = {
    id: '1',
    name: CityName.Göteborg,
    latitude: 57.70887,
    longitude: 11.97456,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCityRepository = {
    find: jest.fn(() => Promise.resolve([mockCity])),
    create: jest.fn((cityData) => cityData),
    save: jest.fn((cityData) => Promise.resolve({ ...mockCity, ...cityData })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCity]);
      expect(cityRepository.find).toHaveBeenCalled();
    });
  });

  describe('createCity', () => {
    it('should create and save a city', async () => {
      const cityData = {
        name: CityName.Göteborg,
        latitude: 57.70887,
        longitude: 11.97456,
      };

      const result = await service.createCity(cityData);

      expect(cityRepository.create).toHaveBeenCalledWith(cityData);
      expect(cityRepository.save).toHaveBeenCalledWith(cityData);
      expect(result).toEqual(expect.objectContaining(cityData));
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CityName } from './types/city.enum';

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  const mockCityResponse = [
    {
      id: '1',
      name: CityName.Göteborg,
      latitude: 57.70887,
      longitude: 11.97456,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockCitiesService = {
    findAll: jest.fn(() => Promise.resolve(mockCityResponse)),
    createCity: jest.fn(() => Promise.resolve(mockCityResponse[0])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCities', () => {
    it('should return all cities', async () => {
      const result = await controller.getAllCities();
      expect(result).toEqual(mockCityResponse);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createACity', () => {
    it('should create a new city', async () => {
      const dto: CreateCityDto = {
        name: CityName.Göteborg,
        latitude: 57.70887,
        longitude: 11.97456,
      };
      const result = await controller.createACity(dto);
      expect(result).toEqual(mockCityResponse[0]);
      expect(service.createCity).toHaveBeenCalledWith(dto);
    });
  });
});

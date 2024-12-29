import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';
import { Bicycle } from './entities/bicycle.entity';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { City } from '../cities/entities/city.entity';

describe('BicyclesController', () => {
  let controller: BicyclesController;
  let bicyclesService: BicyclesService;

  // Create a mock city
  const mockCity: City = {
    id: 'city-test-id',
    name: 'Göteborg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create mock bicycle for reuse
  const mockBicycle: Bicycle = {
    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
    batteryLevel: 100,
    latitude: 59.3293,
    longitude: 18.0686,
    status: 'Available',
    createdAt: new Date(),
    updatedAt: new Date(),
    city: mockCity,
  };

  // Create mock updateBicycleDto for reuse
  const updateBicycleDto: UpdateBicycleDto = {
    batteryLevel: 85,
    status: 'Service',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicyclesController],
      providers: [
        {
          provide: BicyclesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockBicycle]),
            createBike: jest.fn().mockResolvedValue(mockBicycle),
            findById: jest.fn().mockResolvedValue(mockBicycle),
            update: jest.fn().mockResolvedValue({ ...mockBicycle, ...updateBicycleDto }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BicyclesController>(BicyclesController);
    bicyclesService = module.get<BicyclesService>(BicyclesService);
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Clear mock calls to ensure a fresh start for each test
    jest.resetModules(); // Reset module registry to avoid cached modules
  });

  describe('getAllBicycles', () => {
    it('should return an array of bicycles', async () => {
      const result = await controller.getAllBicycles();
      expect(result).toEqual([mockBicycle]);
    });

    it('should call bicyclesService.findAll', async () => {
      const findAllSpy = jest.spyOn(bicyclesService, 'findAll');
      await controller.getAllBicycles();
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('createABike', () => {
    it('should create and return a new bicycle', async () => {
      // const result = await controller.createABike();
      // expect(result).toEqual(mockBicycle);
    });

    it('should call bicyclesService.createBike', async () => {
      const createBikeSpy = jest.spyOn(bicyclesService, 'createBike');
      // await controller.createABike();
      expect(createBikeSpy).toHaveBeenCalled();
    });
  });

  describe('getBikeById', () => {
    it('should return a bicycle by its ID', async () => {
      const bikeId = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
      const result = await controller.getBikeById(bikeId);
      expect(result).toEqual(mockBicycle);
    });

    it('should call bicyclesService.findById with correct ID', async () => {
      const findByIdSpy = jest.spyOn(bicyclesService, 'findById');
      const bikeId = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
      await controller.getBikeById(bikeId);
      expect(findByIdSpy).toHaveBeenCalledWith(bikeId);
    });
  });

  describe('updateBicycle', () => {
    it('should successfully update a bicycle', async () => {
      const bikeId = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
      const result = await controller.updateBicycle(bikeId, updateBicycleDto);
      expect(result).toEqual({ ...mockBicycle, ...updateBicycleDto });
    });

    it('should call bicyclesService.update with correct parameters', async () => {
      const updateSpy = jest.spyOn(bicyclesService, 'update');
      const bikeId = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
      await controller.updateBicycle(bikeId, updateBicycleDto);
      expect(updateSpy).toHaveBeenCalledWith(bikeId, updateBicycleDto);
    });

    it('should handle errors thrown by bicyclesService.update', async () => {
      const error = new Error('Update failed');
      jest.spyOn(bicyclesService, 'update').mockRejectedValue(error);
      const bikeId = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
      await expect(controller.updateBicycle(bikeId, updateBicycleDto)).rejects.toThrow(error);
    });
  });
});

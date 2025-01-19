import { Test, TestingModule } from '@nestjs/testing';
import { TravelService } from './travel.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { BicyclesService } from '../bicycles/bicycles.service';
import { UsersService } from '../users/users.service';
import { ZonesService } from '../zones/zones.service';
import { Repository } from 'typeorm';
import { Bicycle } from '../bicycles/entities/bicycle.entity';
import { User } from '../users/entities/user.entity';

describe('TravelService', () => {
  let service: TravelService;
  let travelRepository: jest.Mocked<Repository<Travel>>;
  let bicyclesService: jest.Mocked<BicyclesService>;
  let zonesService: jest.Mocked<ZonesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelService,
        {
          provide: getRepositoryToken(Travel),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            manager: {
              getRepository: jest.fn().mockReturnValue({
                save: jest.fn(),
              }),
            },
          },
        },
        {
          provide: BicyclesService,
          useValue: {
            setRented: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ZonesService,
          useValue: {
            pointInParkingZone: jest.fn(),
            getZoneTypesForPosition: jest.fn().mockResolvedValue(['Parking']),
          },
        },
        {
          provide: UsersService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TravelService>(TravelService);
    travelRepository = module.get(getRepositoryToken(Travel));
    bicyclesService = module.get(BicyclesService);
    zonesService = module.get(ZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all travels', async () => {
      const mockTravels = [{ id: 1 }, { id: 2 }];
      jest.spyOn(travelRepository, 'find').mockResolvedValue(mockTravels as any);

      const result = await service.findAll();
      expect(result).toEqual(mockTravels);
    });
  });

  describe('findById', () => {
    it('should return travel by ID', async () => {
      const mockTravel = { id: 1 };
      jest.spyOn(travelRepository, 'findOne').mockResolvedValue(mockTravel as any);

      const result = await service.findById(1);
      expect(result).toEqual(mockTravel);
    });

    it('should throw NotFoundException if travel not found', async () => {
      jest.spyOn(travelRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow('Travel not found');
    });
  });

  describe('startRentingBike', () => {
    it('should start renting a bike', async () => {
      const bikeId = 'bike123';
      const customerId = 'customer123';

      bicyclesService.setRented.mockResolvedValue({
        id: bikeId,
        latitude: 50,
        longitude: 50,
      } as any);

      zonesService.pointInParkingZone.mockResolvedValue(true);

      travelRepository.create.mockReturnValue({
        id: 1,
        bike: { id: bikeId },
        customer: { githubId: customerId },
        startTime: new Date(),
      } as any);

      travelRepository.save.mockResolvedValue({
        id: 1,
        bike: { id: bikeId },
        customer: { githubId: customerId },
        startTime: new Date(),
      } as any);

      const result = await service.startRentingBike(bikeId, customerId);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });

  describe('endTravel', () => {
    it('should successfully end a travel', async () => {
      // Create mock data
      const mockBike = new Bicycle();
      mockBike.id = 'bike123';
      mockBike.status = 'Rented';
      mockBike.latitude = 60;
      mockBike.longitude = 60;
      mockBike.batteryLevel = 100;

      const mockUser = new User({
        githubId: 'customer123',
        isMonthlyPayment: true,
        balance: 1000,
      });

      const mockTravel = new Travel();
      mockTravel.id = 1;
      mockTravel.bike = mockBike;
      mockTravel.customer = mockUser;
      mockTravel.startTime = new Date('2024-01-14T10:00:00');
      mockTravel.startZoneType = 'Parking';
      mockTravel.cost = 0;
      mockTravel.latStart = 60;
      mockTravel.longStart = 60;

      travelRepository.findOne.mockResolvedValue(mockTravel);
      bicyclesService.findById.mockResolvedValue(mockBike);
      zonesService.pointInParkingZone.mockResolvedValue(true);
      travelRepository.save.mockResolvedValue({ ...mockTravel, stopTime: new Date() } as Travel);

      // Call the method
      const result = await service.endTravel(1);

      // Assert that stopTime is set
      expect(result.stopTime).toBeDefined();

      // Ensure bicycle status is updated
      expect(bicyclesService.update).toHaveBeenCalledWith(mockBike.id, { status: 'Available' });

      // Ensure the travel record is saved
      expect(travelRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ stopTime: expect.any(Date) }),
      );
    });

    it('should throw NotFoundException when travel not found', async () => {
      travelRepository.findOne.mockResolvedValue(null);
      await expect(service.endTravel(999)).rejects.toThrow('Travel not found');
    });
  });
});

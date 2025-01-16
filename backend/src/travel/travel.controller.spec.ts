import { Test, TestingModule } from '@nestjs/testing';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';

describe('TravelController', () => {
  let controller: TravelController;
  let service: TravelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelController],
      providers: [
        {
          provide: TravelService,
          useValue: {
            findTravelsForCustomer: jest.fn(),
            findActiveTravelForBike: jest.fn(),
            endActiveTravelForBike: jest.fn(),
            endAllTravelsForCustomer: jest.fn(),
            startRentingBike: jest.fn(),
            endTravel: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TravelController>(TravelController);
    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTravelsForCustomer', () => {
    it('should return all travels for a customer', async () => {
      const mockTravels = [{ id: 1 }, { id: 2 }];
      jest.spyOn(service, 'findTravelsForCustomer').mockResolvedValue(mockTravels as any);

      const result = await controller.getTravelsForCustomer('customer-123');
      expect(result).toEqual(mockTravels);
    });
  });

  describe('getActiveTravelForBike', () => {
    it('should return active travel for a bike', async () => {
      const mockTravel = { id: 1 };
      jest.spyOn(service, 'findActiveTravelForBike').mockResolvedValue(mockTravel as any);

      const result = await controller.getActiveTravelForBike('bike-123');
      expect(result).toEqual(mockTravel);
    });
  });

  describe('startRentingBike', () => {
    it('should start renting a bike', async () => {
      const mockTravel = { id: 1 };
      const req = { user: { githubId: 'user-456' } };
      jest.spyOn(service, 'startRentingBike').mockResolvedValue(mockTravel as any);

      const result = await controller.startRentingBike('bike-123', req);
      expect(result).toEqual(mockTravel);
    });
  });

  describe('endTravel', () => {
    it('should end a travel', async () => {
      jest.spyOn(service, 'endTravel').mockResolvedValue({ id: 1 } as any);

      const result = await controller.endTravel(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getTravelById', () => {
    it('should return travel by ID', async () => {
      const mockTravel = { id: 1 };
      jest.spyOn(service, 'findById').mockResolvedValue(mockTravel as any);

      const result = await controller.getTravelById(1);
      expect(result).toEqual(mockTravel);
    });
  });

  describe('getAllTravels', () => {
    it('should return all travels', async () => {
      const mockTravels = [{ id: 1 }, { id: 2 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockTravels as any);

      const result = await controller.getAllTravels();
      expect(result).toEqual(mockTravels);
    });
  });
});

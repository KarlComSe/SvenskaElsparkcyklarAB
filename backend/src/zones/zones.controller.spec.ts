import { Test, TestingModule } from '@nestjs/testing';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ZonesController', () => {
  let controller: ZonesController;
  let zonesService: ZonesService;

  // Create mock zone for reuse
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
      controllers: [ZonesController],
      providers: [
        {
          provide: ZonesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockZone]),
          }
        }
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ZonesController>(ZonesController);
    zonesService = module.get<ZonesService>(ZonesService);
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Clear mock calls to ensure a fresh start for each test
    jest.resetModules(); // Reset module registry to avoid cached modules
  });

  describe('getAllZones', () => {
    it('should return an array of zones', async () => {
      const result = await controller.getAllZones();
      expect(result).toEqual([mockZone]);
    });

    it('should call zonesService.findAll', async () => {
      const findAllSpy = jest.spyOn(zonesService, 'findAll');
      await controller.getAllZones();
      expect(findAllSpy).toHaveBeenCalled();
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZoneFilterQueryDto } from './dto/zone-filter-query.dto';
import { CityName } from 'src/cities/types/city.enum';

describe('ZonesController', () => {
  let controller: ZonesController;
  let zonesService: ZonesService;

  // Create mock zone for reuse
  const mockZone: Zone = {
    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
    polygon: [
      { lat: 59.3293, lng: 18.0686 },
      { lat: 59.3294, lng: 18.0687 },
    ],
    name: 'Test Zone',
    type: 'speed',
    speedZone: {
      id: 'c2f88dd4-0ba9-5f7c-b5d7-c7fc59f59465',
      speedLimit: 20.5,
      zone: null,
    },
    city: {
      id: '755cacbd-fc18-4884-8859-96fa814b1eb2',
      name: CityName.Jönköping,
      latitude: null,
      longitude: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockZoneResponse = {
    filters: {
      lat: 59.3293,
      lon: 18.0686,
      type: ['speed'],
      includes: [],
      city: ['Jönköping'],
      rad: 3,
    },
    zones: [mockZone]
  };

  const query: ZoneFilterQueryDto = {
    lat: 59.3293,
    lon: 18.0686,
    type: 'speed',
    city: 'Jönköping',
    rad: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonesController],
      providers: [
        {
          provide: ZonesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockZone]),
            getZonesByFilter: jest.fn().mockResolvedValue({ zones: [mockZone] })
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ZonesController>(ZonesController);
    zonesService = module.get<ZonesService>(ZonesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('getAllZones', () => {
    it('should return zones with filters', async () => {
      const result = await controller.getAllZones(query);
      expect(result).toHaveProperty('filters');
      expect(result).toHaveProperty('zones');
      expect(result.zones).toEqual([mockZone]);
    });

    it('should call zonesService.getZonesByFilter', async () => {
      const getZonesByFilterSpy = jest.spyOn(zonesService, 'getZonesByFilter');
      await controller.getAllZones(query);
      expect(getZonesByFilterSpy).toHaveBeenCalled();
    });
  });
});
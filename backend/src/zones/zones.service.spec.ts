import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone';
import { Repository } from 'typeorm';
import { BicyclesService } from '../bicycles/bicycles.service';
import { CityName } from '../cities/types/city.enum';

describe('ZonesService', () => {
  let service: ZonesService;
  let repository: Repository<Zone>;
  let bicyclesService: BicyclesService;

  const mockCities = {
    goteborg: {
      id: 'city-1',
      name: CityName.Göteborg,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    karlshamn: {
      id: 'city-2',
      name: CityName.Karlshamn,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    jonkoping: {
      id: 'city-3',
      name: CityName.Jönköping,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockZones = [
    {
      id: 'zone-1',
      polygon: [
        { lat: 57.7089, lng: 11.9726 },
        { lat: 57.7092, lng: 11.9734 },
        { lat: 57.7088, lng: 11.9746 },
        { lat: 57.7084, lng: 11.9738 },
        { lat: 57.7089, lng: 11.9726 },
      ],
      type: 'parking',
      name: 'Central Station P-hus',
      city: mockCities.goteborg,
    },
    {
      id: 'zone-2',
      polygon: [
        { lat: 57.7, lng: 11.9753 },
        { lat: 57.7047, lng: 11.9745 },
        { lat: 57.7048, lng: 11.9757 },
        { lat: 57.7001, lng: 11.9765 },
        { lat: 57.7, lng: 11.9753 },
      ],
      type: 'speed',
      name: 'Avenyn Hastighetszon',
      city: mockCities.goteborg,
      speedZone: {
        id: 'speed-1',
        speedLimit: 30,
        zone: null,
      },
    },
    {
      id: 'zone-3',
      polygon: [
        { lat: 56.1708, lng: 14.8631 },
        { lat: 56.1712, lng: 14.8637 },
        { lat: 56.1709, lng: 14.8643 },
        { lat: 56.1705, lng: 14.8637 },
        { lat: 56.1708, lng: 14.8631 },
      ],
      type: 'parking',
      name: 'Centrum Parkering Karlshamn',
      city: mockCities.karlshamn,
    },
  ] as Zone[];

  const mockBicycles = [
    {
      id: 'bike-1',
      latitude: 57.7090,
      longitude: 11.9730,
    },
    {
      id: 'bike-2',
      latitude: 56.1710,
      longitude: 14.8635,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonesService,
        {
          provide: getRepositoryToken(Zone),
          useValue: {
            find: jest.fn().mockImplementation((query) => {
              if (query.where?.city?.name) {
                return Promise.resolve(
                  mockZones.filter(zone => zone.city.name === query.where.city.name)
                );
              }
              return Promise.resolve(mockZones);
            }),
            findOne: jest.fn().mockImplementation((query) => {
              return Promise.resolve(
                mockZones.find((zone) => {
                  if (query.where.city?.name) {
                    return zone.city.name === query.where.city.name;
                  }
                  return false;
                }),
              );
            }),
          },
        },
        {
          provide: BicyclesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockBicycles),
          },
        },
      ],
    }).compile();

    service = module.get<ZonesService>(ZonesService);
    repository = module.get(getRepositoryToken(Zone));
    bicyclesService = module.get<BicyclesService>(BicyclesService);
  });

  describe('findAll (Low value test, it only tests TypeOrm, not our logic or code)', () => {
    it('should return all zones with proper relations', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockZones);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['speedZone', 'city'],
      });
    });
  });

  describe('findByCity (Low value test, it only tests TypeOrm, not our logic or code)', () => {
    it('should find zones in Göteborg', async () => {
      const result = await service.findByCity(CityName.Göteborg);
      console.log(result);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(zone => zone.city.name === CityName.Göteborg)).toBeTruthy();
    });

    it('should return empty array for city with no zones', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result = await service.findByCity(CityName.Jönköping);
      expect(result).toEqual([]);
    });
  });

  describe('getZonesByFilter (Low value test, it only tests TypeOrm, not our logic or code)', () => {
    it('should filter by type ', async () => {
      const result = await service.getZonesByFilter({
        type: ['parking'],
      });
      expect(result.zones.every(zone => zone.type === 'parking')).toBeTruthy();
    });

    it('should filter by city', async () => {
      const result = await service.getZonesByFilter({
        city: [CityName.Göteborg],
      });
      expect(result.zones.every(zone => zone.city.name === CityName.Göteborg)).toBeTruthy();
    });

    it('should filter by location and radius', async () => {
      const result = await service.getZonesByFilter({
        lat: 57.7089,
        lon: 11.9726,
        rad: 1000, // 1km radius
      });
      expect(result.zones.length).toBeGreaterThan(0);
    });

    it('should include bikes in zones when requested', async () => {
      const result = await service.getZonesByFilter({
        includes: ['bikes'],
      });
      expect(result.zones[0]).toHaveProperty('bikes');
      expect(bicyclesService.findAll).toHaveBeenCalled();
    });

    it('should combine multiple filters', async () => {
      const result = await service.getZonesByFilter({
        type: ['parking'],
        city: [CityName.Göteborg],
        includes: ['bikes'],
      });
      
      expect(result.zones.every(zone => 
        zone.type === 'parking' && 
        zone.city.name === CityName.Göteborg &&
        zone.hasOwnProperty('bikes')
      )).toBeTruthy();
    });
  });

  describe('pointInParkingZone (high value test)', () => {
    it('should return true when point is inside parking zone', async () => {
      // 57.70881973169575, 11.97332955917781
      const result = await service.pointInParkingZone(57.70881973169575, 11.97332955917781);
      expect(result).toBeTruthy();
    });

    it('should return false when point is outside parking zones', async () => {
      const result = await service.pointInParkingZone(57.0000, 11.0000);
      expect(result).toBeFalsy();
    });
  });
});
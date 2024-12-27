import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone';
import { ZoneQuery } from './types/ZoneQuery';
import { ZoneResponse } from './types/ZoneResponse';
import { BicyclesService } from 'src/bicycles/bicycles.service';
import { getDistance, positionInsidePolygon } from 'src/utils/geo.utils';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    private readonly bicyclesService: BicyclesService
  ) {}

  async findAll(): Promise<Zone[]> {
    return await this.zoneRepository.find({
      relations: ['speedZone', 'city'],
    });
  }

  async findByCity(
    cityName: 'Göteborg' | 'Jönköping' | 'Karlshamn',
  ): Promise<Zone[]> {
    return await this.zoneRepository.find({
      where: {
        city: {
          name: cityName,
        },
      },
      relations: ['city'],
    });
  }

  async getZones(lat: number, lon: number): Promise<Zone[]> {
    let zones = await this.findAll();
    const point = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Point' as const,
        coordinates: [lon, lat],
      },
    };
    zones = zones.filter((zone) => {
      return positionInsidePolygon(lat, lon, zone.polygon);
    });
    return zones;
  }

  async getZonesByFilter(query: ZoneQuery): Promise<ZoneResponse> {
    const zones : ZoneResponse = {
      zones: [],
    }; 
    zones.zones = await this.findAll();

    if (query.city && query.city.length > 0) {
      zones.zones = zones.zones.filter((zone) => {
        return query.city.includes(zone.city.name);
      })
    }

    if (query.type && query.type.length > 0) {
      zones.zones = zones.zones.filter((zone) => {
        return query.type.includes(zone.type);
      })
    }

    if (query.lat && query.lon) {
      console.log(query.lat, query.lon);
      zones.zones = zones.zones.filter((zone) => {
        return getDistance(query.lat, query.lon, zone.polygon[0].lat, zone.polygon[0].lng) <= query.rad;
      })
    }

    if (query.includes && query.includes.length > 0) {
      const allBikes = await this.bicyclesService.findAll(); 
      zones.zones = zones.zones.map((zone) => {
        const bikes = allBikes.filter((bike) => {
          return positionInsidePolygon(bike.latitude, bike.longitude, zone.polygon);
        });
        return {
          ...zone,
          bikes: bikes,
        }
      });
    }

    return zones;
  }

  async pointInParkingZone(lat: number, lon: number): Promise<boolean> {
    const zones = await this.findAll();
    return zones.some((zone) => {
      return positionInsidePolygon(lat, lon, zone.polygon);
    });
  }
}

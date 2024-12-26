import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone';
import * as turf from "@turf/turf";

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
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
      const polygon = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [zone.polygon.map((p) => [p.lng, p.lat])],
        },
      };
      return turf.pointsWithinPolygon(point, polygon).features.length > 0;
    });
    return zones;
  }
  
  static getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const from = turf.point([lon1, lat1]);
    const to = turf.point([lon2, lat2]);
    return turf.distance(from, to)*1000;
  } 
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone';
import { ZoneQuery } from './types/ZoneQuery';
import { ZoneResponse } from './types/ZoneResponse';
import { BicyclesService } from 'src/bicycles/bicycles.service';
import { getDistance, positionInsidePolygon } from 'src/utils/geo.utils';
import { CityName } from 'src/cities/types/city.enum';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    private readonly bicyclesService: BicyclesService,
  ) {}

  async findAll(): Promise<Zone[]> {
    return await this.zoneRepository.find({
      relations: ['speedZone', 'city'],
    });
  }

  async findByCity(cityName: CityName): Promise<Zone[]> {
    return await this.zoneRepository.find({
      relations: ['city'],
      where: {
        city: {
          name: cityName,
        },
      },
    });
  }

  // seems unused
  // async getZones(lat: number, lon: number): Promise<Zone[]> {
  //   let zones = await this.findAll();
  //   zones = zones.filter((zone) => {
  //     return positionInsidePolygon(lat, lon, zone.polygon);
  //   });
  //   return zones;
  // }

  async getZonesByFilter(query: ZoneQuery): Promise<ZoneResponse> {
    const zones: ZoneResponse = {
      zones: [],
    };
    zones.zones = await this.findAll();

    if (query.city && query.city.length > 0) {
      zones.zones = zones.zones.filter((zone) => {
        return query.city.includes(zone.city.name);
      });
    }

    if (query.type && query.type.length > 0) {
      zones.zones = zones.zones.filter((zone) => {
        return query.type.includes(zone.type);
      });
    }

    if (query.lat && query.lon) {
      console.log(query.lat, query.lon);
      zones.zones = zones.zones.filter((zone) => {
        return (
          getDistance(query.lat, query.lon, zone.polygon[0].lat, zone.polygon[0].lng) <= query.rad
        );
      });
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
        };
      });
    }

    return zones;
  }

  async getZoneTypesForPosition(lat: number, lon: number): Promise<string[]> {
    const parkingZones = (await this.findAll()).filter((zone) => {
      return zone.type === 'parking';
    });
    const chargingZones = (await this.findAll()).filter((zone) => {
      return zone.type === 'charging';
    });

    const parking = parkingZones.some((zone) => {
      return positionInsidePolygon(lat, lon, zone.polygon);
    });

    const charging = chargingZones.some((zone) => {
      return positionInsidePolygon(lat, lon, zone.polygon);
    });

    const types = [];

    if (parking) {
      types.push('Parking');
    }

    if (charging) {
      types.push('Charging');
    }

    return types;
  }

  async pointInParkingZone(lat: number, lon: number): Promise<boolean> {
    const zones = (await this.findAll()).filter((zone) => {
      return zone.type === 'parking';
    });
    return zones.some((zone) => {
      return positionInsidePolygon(lat, lon, zone.polygon);
    });
  }
}

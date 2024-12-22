import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone';

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
}

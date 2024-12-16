import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) {}

    async findAll(): Promise<City[]> {
        return await this.cityRepository.find();
    }
}

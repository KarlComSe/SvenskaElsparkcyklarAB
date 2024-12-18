import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';

@Injectable()
export class TravelService {
    constructor(
        @InjectRepository(Travel)
        private travelRepository: Repository<Travel>,
    ) {}

    async findAll(): Promise<Travel[]> {
        return await this.travelRepository.find();
    }
}

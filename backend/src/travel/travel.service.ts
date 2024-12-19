import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TravelService {
    constructor(
        @InjectRepository(Travel)
        private travelRepository: Repository<Travel>,
    ) {}

    async findAll(): Promise<Travel[]> {
        return await this.travelRepository.find();
    }

      // Find a travel by ID
    async findById(id: number): Promise<Travel> {
        const travel = await this.travelRepository.findOne({ where: { id } });
        if (!travel) {
        throw new NotFoundException('travel not found');
        }
        return travel;
    }
}

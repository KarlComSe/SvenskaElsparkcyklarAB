import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle } from './entities/bicycle.entity';

@Injectable()
export class BicyclesService {
    constructor(
        @InjectRepository(Bicycle)
        private readonly bicycleRepository: Repository<Bicycle>,
    ) {}

    async findAll(): Promise<Bicycle[]> {
        return await this.bicycleRepository.find();
    }
}

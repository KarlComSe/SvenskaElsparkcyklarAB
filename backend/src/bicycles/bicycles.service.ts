import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BicyclesService {
    constructor(
        @InjectRepository(Bicycle)
        private readonly bicycleRepository: Repository<Bicycle>,
    ) {}

    async findAll(): Promise<Bicycle[]> {
        return await this.bicycleRepository.find();
    }

    async createBike(data?: Partial<Bicycle>): Promise<Bicycle> {
        const bike = this.bicycleRepository.create(data);
        return await this.bicycleRepository.save(bike);
    }

    async findById(id: string): Promise<Bicycle> {
        const bike = await this.bicycleRepository.findOne({ where: { id } });
        if (!bike) {
            throw new NotFoundException('Bike not found');
        }
        return bike;
    }

}

// {
//     batteryLevel: 100,
//     latitude: 59.3293,
//     longitude: 18.0686,
//     status: 'Available',
// },

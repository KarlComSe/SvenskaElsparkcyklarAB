import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { BicycleResponse } from './types/bicycle-response.interface';

@Injectable()
export class BicyclesService {
  constructor(
    @InjectRepository(Bicycle)
    private readonly bicycleRepository: Repository<Bicycle>,
  ) {}

  async findAll(): Promise<BicycleResponse[]> {
    const bikes = await this.bicycleRepository.find({
      relations: {
        city: true,
      },
      select: {
        id: true,
        batteryLevel: true,
        latitude: true,
        longitude: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        city: {
          name: true,
        },
      },
    });

    return bikes.map((bike) => {
      return {
        ...bike,
        city: bike.city.name,
      };
    });
  }

  async createBike(data?: Partial<Bicycle>): Promise<Bicycle> {
    const bike = this.bicycleRepository.create(data);
    return await this.bicycleRepository.save(bike);
  }

  async findById(id: string): Promise<Bicycle> {
    const bike = await this.bicycleRepository.findOne({
      where: { id },
      relations: {
        city: true,
      },
    });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return bike;
  }

  async update(
    id: string,
    updateBicycleDto: UpdateBicycleDto,
  ): Promise<Bicycle> {
    const bike = await this.findById(id);

    return this.bicycleRepository.save({ ...bike, ...updateBicycleDto });
  }

  async findByCity(
    cityName: 'Göteborg' | 'Jönköping' | 'Karlshamn',
  ): Promise<Bicycle[]> {
    return await this.bicycleRepository.find({
      where: {
        city: {
          name: cityName,
        },
      },
      relations: ['city'],
    });
  }
}

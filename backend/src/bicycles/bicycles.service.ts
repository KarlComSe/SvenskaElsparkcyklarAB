import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { BicycleResponse } from './types/bicycle-response.interface';
import { getDistance } from 'src/utils/geo.utils';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { City } from 'src/cities/entities/city.entity';

@Injectable()
export class BicyclesService {
  constructor(
    @InjectRepository(Bicycle)
    private readonly bicycleRepository: Repository<Bicycle>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async findAll(): Promise<Bicycle[]> {
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

    return bikes;
  }

  async setRented(bikeId: string): Promise<Bicycle> {
    const result = await this.bicycleRepository.update(
      { id: bikeId, status: 'Available' },
      { status: 'Rented' },
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        "Bike couldn't be rented. Bike might not exist or it is not available.",
      );
    }
    return await this.findById(bikeId);
  }

  async createBike(createBicycleDto: CreateBicycleDto): Promise<Bicycle> {
    const bike = this.bicycleRepository.create({
      batteryLevel: createBicycleDto.batteryLevel ?? 100,
      latitude: createBicycleDto.latitude,
      longitude: createBicycleDto.longitude,
      status: createBicycleDto.status ?? 'Available',
    });

    const city = createBicycleDto.city ?? 'Göteborg';
    // Find the city by name
    const cityEntity = await this.cityRepository.findOne({
      where: { name: city },
    });

    if (cityEntity) {
      bike.city = cityEntity;
    }

    return await this.bicycleRepository.save(bike);
  }

  async createManyBikes(createBicycleDto: CreateBicycleDto[]): Promise<Bicycle[]> {
    const defaultCity = await this.cityRepository.findOne({
      where: { name: 'Göteborg' },
    });
    const Karlshamn = await this.cityRepository.findOne({
      where: { name: 'Karlshamn' },
    });
    const Jönköping = await this.cityRepository.findOne({
      where: { name: 'Jönköping' },
    });

    const bikes = createBicycleDto.map((bike) => {
      return this.bicycleRepository.create({
        batteryLevel: bike.batteryLevel ?? 100,
        latitude: bike.latitude,
        longitude: bike.longitude,
        status: bike.status ?? 'Available',
        city:
          bike.city === 'Jönköping'
            ? Jönköping
            : bike.city === 'Karlshamn'
              ? Karlshamn
              : defaultCity,
      });
    });

    return await this.bicycleRepository.save(bikes);
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

  async update(id: string, updateBicycleDto: UpdateBicycleDto): Promise<Bicycle> {
    const bike = await this.findById(id);

    return this.bicycleRepository.save({ ...bike, ...updateBicycleDto });
  }

  async findByCity(cityName: 'Göteborg' | 'Jönköping' | 'Karlshamn'): Promise<Bicycle[]> {
    const bikes = await this.bicycleRepository.find({
      where: {
        city: {
          name: cityName,
        },
      },
      relations: ['city'],
    });

    return bikes;
  }
  async findByLocation(lat: number, lon: number, radius: number): Promise<Bicycle[]> {
    const allBikes = await this.findAll();
    const filteredBikes = allBikes.filter((bike) => {
      return getDistance(bike.latitude, bike.longitude, lat, lon) <= radius;
    });
    return filteredBikes;
  }
  async findByCityAndLocation(
    city: any,
    lat: number,
    lon: number,
    radius: number,
  ): Promise<Bicycle[]> {
    const bikesInCity = await this.findByCity(city);
    const filteredBikes = bikesInCity.filter((bike) => {
      return getDistance(bike.latitude, bike.longitude, lat, lon) <= radius;
    });
    return filteredBikes;
  }

  private toBicycleResponse(bike: Bicycle): BicycleResponse {
    return {
      id: bike.id,
      batteryLevel: bike.batteryLevel,
      latitude: bike.latitude,
      longitude: bike.longitude,
      status: bike.status,
      city: bike.city?.name,
      createdAt: bike.createdAt,
      updatedAt: bike.updatedAt,
    };
  }

  toBicycleResponses(bikes: Bicycle[]): BicycleResponse[] {
    return bikes.map((bike) => this.toBicycleResponse(bike));
  }
}

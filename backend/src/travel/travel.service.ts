import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { BicyclesService } from '../bicycles/bicycles.service';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    private readonly bicyclesService: BicyclesService,
  ) {}

  async findAll(): Promise<Travel[]> {
    return await this.travelRepository.find();
  }

  async findById(id: number): Promise<Travel> {
    const travel = await this.travelRepository.findOne({ where: { id } });
    if (!travel) {
      throw new NotFoundException('Travel not found');
    }
    return travel;
  }

  async startRentingBike(bikeId: string, customerId: string): Promise<Travel> {
    const bike = await this.bicyclesService.findById(bikeId);
    if (!bike) {
      throw new BadRequestException('Bike not found');
    }

    if (bike.status !== 'Available') {
      throw new BadRequestException('Bike is not available for renting');
    }

    const zoneType = this.getZoneType(bike.latitude, bike.longitude);

    const travel = this.travelRepository.create({
      bike,
      startTime: new Date(),
      latStart: bike.latitude,
      longStart: bike.longitude,
      customer: { githubId: customerId },
      startZoneType: zoneType,
      endZoneType: null,
      cost: 0,
    });

    // Update the bicycle status
    await this.bicyclesService.update(bike.id, { status: 'Rented' });

    return this.travelRepository.save(travel);
  }

  async endTravel(travelId: number): Promise<Travel> {
    const travel = await this.travelRepository.findOne({ 
        where: { id: travelId },
        relations: ['bike'] // Ensure we load the bike relation
    });

    if (!travel) {
        throw new NotFoundException('Travel not found');
    }

    if (travel.stopTime) {
        throw new BadRequestException('Travel has already ended');
    }

    // Get current bike location (from bike entity)
    const bike = await this.bicyclesService.findById(travel.bike.id);
    
    // Get the end zone type
    const endZoneType = this.getZoneType(bike.latitude, bike.longitude);

    // Set end time to current server time
    const endTime = new Date();

    // Calculate cost
    const cost = this.calculateCost(
        travel.startTime,
        endTime,
        travel.startZoneType,
        endZoneType
    );

    // Update travel record
    travel.stopTime = endTime;
    travel.latStop = bike.latitude;
    travel.longStop = bike.longitude;
    travel.endZoneType = endZoneType;
    travel.cost = cost;

    // Update bike status to available
    await this.bicyclesService.update(bike.id, { status: 'Available' });

    // Save and return updated travel
    return this.travelRepository.save(travel);
  }


  getZoneType(lat: number, long: number): 'Free' | 'Parking' {
    // Dummy implementation for now
    return 'Free';
  }

  
  calculateCost(
    startTime: Date,
    endTime: Date,
    startZoneType: string,
    endZoneType: string,
  ): number {
    // Dummy implementation for now
    return 50; // Example fixed cost
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { BicyclesService } from '../bicycles/bicycles.service';
import { ZonesService } from 'src/zones/zones.service';

@Injectable()
export class TravelService {
  async findTravelsForCustomer(customerId: string) {
    return await this.travelRepository.find({
      where: { customer: { githubId: customerId } },
    });
  }
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    private readonly bicyclesService: BicyclesService,
    private readonly zonesService: ZonesService,
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

  async findActiveTravelForBike(bikeId: string): Promise<Travel> {
    const activeTravel = await this.travelRepository.findOne({
      where: {
        bike: { id: bikeId },
        startTime: Not(IsNull()),
        stopTime: IsNull(),
      },
    });

    if (!activeTravel) {
      throw new NotFoundException(`No active travel found for bike ${bikeId}`);
    }

    return activeTravel;
  }

  async startRentingBike(bikeId: string, customerId: string): Promise<Travel> {
    const bike = await this.bicyclesService.setRented(bikeId);
    const zoneType = this.zonesService.pointInParkingZone(bike.latitude, bike.longitude)
      ? 'Parking'
      : 'Free';

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

    return this.travelRepository.save(travel);
  }

  async endActiveTravelForBike(bikeId: string) {
    const activeTravel = await this.findActiveTravelForBike(bikeId);
    return this.endTravel(activeTravel.id);
  }

  async endTravel(travelId: number): Promise<Travel> {
    const travel = await this.travelRepository.findOne({
      where: { id: travelId },
      relations: ['bike', 'customer'], // Load bike and customer relations
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
    const endZoneType = this.zonesService.pointInParkingZone(bike.latitude, bike.longitude)
      ? 'Parking'
      : 'Free';

    // Set end time to current server time
    const endTime = new Date();

    // Calculate cost
    const cost = this.calculateCost(travel.startTime, endTime, travel.startZoneType, endZoneType);

    // Update travel record
    travel.stopTime = endTime;
    travel.latStop = bike.latitude;
    travel.longStop = bike.longitude;
    travel.endZoneType = endZoneType;
    travel.cost = cost;

    // Update bike status to available
    await this.bicyclesService.update(bike.id, { status: 'Available' });

    // Update user account
    const customer = travel.customer;

    if (customer.isMonthlyPayment) {
      // Accumulate cost for monthly payment users
      customer.accumulatedCost += cost;
    } else {
      // Deduct from balance for prepaid users
      if (customer.balance < cost) {
        throw new BadRequestException('Insufficient balance. Please insert funds.');
      }
      customer.balance -= cost;
    }

    // Save updated user
    await this.travelRepository.manager.getRepository('User').save(customer);

    // Save and return updated travel
    return this.travelRepository.save(travel);
  }

  async endAllTravelsForCustomer(githubId: string): Promise<string> {
    // Find all active travels for the customer
    const activeTravels = await this.travelRepository.find({
      where: {
        customer: { githubId: githubId },
        startTime: Not(IsNull()),
        stopTime: IsNull(),
      },
      relations: ['bike', 'customer'],
    });

    if (activeTravels.length === 0) {
      throw new NotFoundException(
        `No active travels found for customer with GitHub ID ${githubId}.`,
      );
    }

    // Loop through each active travel and end it using the existing endTravel method
    for (const travel of activeTravels) {
      await this.endTravel(travel.id);
    }

    return `All active travels for customer with GitHub ID ${githubId} have been successfully ended.`;
  }

  calculateCost(
    startTime: Date,
    endTime: Date,
    startZoneType: string,
    endZoneType: string,
  ): number {
    const timeDiff = endTime.getTime() - startTime.getTime();
    const timeDiffInMinutes = timeDiff / 1000 / 60;

    const parkingFee = 10;
    const startFee = 10;
    const costPerMinute = 1;

    const cost =
      (endZoneType === 'Parking' ? 0 : parkingFee) +
      (startZoneType === 'Free' && endZoneType === 'Parking' ? startFee / 2 : startFee) +
      timeDiffInMinutes * costPerMinute;

    return cost;
  }
}

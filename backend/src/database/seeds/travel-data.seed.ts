import { DataSource } from 'typeorm';
import { Travel } from '../../travel/entities/travel.entity';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';
import { User } from '../../users/entities/user.entity';
import { Zone } from 'src/zones/entities/zone';
import { TravelService } from '../../travel/travel.service';
import { BicyclesService } from '../../bicycles/bicycles.service';
import { ZonesService } from '../../zones/zones.service';
import { City } from 'src/cities/entities/city.entity';

export default class TravelDataSeeder {
  async run(connection: DataSource): Promise<void> {
    if (true) {
      //process.env.NODE_ENV !== 'production') {
      const travelRepository = connection.getRepository(Travel);
      const bikeRepository = connection.getRepository(Bicycle);
      const userRepository = connection.getRepository(User);
      const zoneRepository = connection.getRepository(Zone);
      const cityRepository = connection.getRepository(City);

      const bicycleService = new BicyclesService(bikeRepository, cityRepository);
      const zonesService = new ZonesService(zoneRepository, bicycleService);
      const travelService = new TravelService(travelRepository, bicycleService, zonesService);

      const bikes = await bikeRepository.find({ take: 10 });
      const users = await userRepository.find({ take: 4 });

      let userIndex = 0;

      try {
        for (const bike of bikes) {
          await travelService.startRentingBike(bike.id, users[userIndex].githubId);
          // console.log(`Created ongoing travel for bike ${bike.id}`);
          userIndex = (userIndex + 1) % users.length;
        }
      } catch {
        // silently ignore errors, as expected
        // console.error('Error creating ongoing travels:', error);
      }

      // Fetch references for existing bikes and customers

      // Note that bike reference in seed is made by 'batteryLevel' for now
      const bike1 = await bikeRepository.findOneBy({ batteryLevel: 95 });
      const bike2 = await bikeRepository.findOneBy({ batteryLevel: 88 });
      const user1 = await userRepository.findOneBy({ githubId: '149484382' });
      const user2 = await userRepository.findOneBy({ githubId: '13668660' });

      if (!bike1 || !bike2 || !user1 || !user2) {
        throw new Error(
          'Bikes or Users not found. Make sure they exist before seeding Travel data.',
        );
      }

      // Create travel data
      const travels = travelRepository.create([
        {
          bike: bike1,
          startTime: new Date('2024-01-01T08:00:00.000Z'),
          stopTime: new Date('2024-01-01T09:00:00.000Z'),
          latStart: 59.3293,
          longStart: 18.0686,
          latStop: 59.3328,
          longStop: 18.0649,
          customer: user1,
          cost: 50.0,
          startZoneType: 'Free',
          endZoneType: 'Parking',
        },
        {
          bike: bike2,
          startTime: new Date('2024-01-02T10:00:00.000Z'),
          stopTime: new Date('2024-01-02T11:00:00.000Z'),
          latStart: 59.3315,
          longStart: 18.07,
          latStop: 59.3299,
          longStop: 18.071,
          customer: user2,
          cost: 75.0,
          startZoneType: 'Parking',
          endZoneType: 'Free',
        },
      ]);

      // console.log('Bike1:', bike1);
      // console.log('Bike2:', bike2);
      // console.log('User1:', user1);
      // console.log('User2:', user2);

      // try {
      await travelRepository.save(travels);
      //     console.log('Travel data saved successfully!');
      // } catch (error) {
      //     console.error('Error saving travels:', error);
      // }
    }
  }
}

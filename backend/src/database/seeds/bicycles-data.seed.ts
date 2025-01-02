import { DataSource } from 'typeorm';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';
import { City } from '../../cities/entities/city.entity';
import { CityName } from 'src/cities/types/city.enum';

export default class BicycleSeeder {
  async run(connection: DataSource): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const bicycleRepo = connection.getRepository(Bicycle);
      const cityRepo = connection.getRepository(City);

      // keeping debug logs for now
      let goteborg = await cityRepo.findOne({ where: { name: CityName.Göteborg } });
      if (!goteborg) {
        // console.log('Creating Göteborg...');
        goteborg = cityRepo.create({ name: CityName.Göteborg });
        await cityRepo.save(goteborg);
        // console.log('Göteborg created with ID:', goteborg.id);
      }

      let karlshamn = await cityRepo.findOne({ where: { name: CityName.Karlshamn } });
      if (!karlshamn) {
        // console.log('Creating Karlshamn...');
        karlshamn = cityRepo.create({ name: CityName.Karlshamn });
        await cityRepo.save(karlshamn);
        // console.log('Karlshamn created with ID:', karlshamn.id);
      }

      let jonkoping = await cityRepo.findOne({ where: { name: CityName.Jönköping } });
      if (!jonkoping) {
        // console.log('Creating Jönköping...');
        jonkoping = cityRepo.create({ name: CityName.Jönköping });
        await cityRepo.save(jonkoping);
        // console.log('Jönköping created with ID:', jonkoping.id);
      }

      // const cities = await cityRepo.find();
      // console.log('Available cities:', cities);
      // console.log(goteborg)
      // console.log(karlshamn)

      // Add example bicycles
      // Göteborg bikes
      type BicycleStatus = 'Available' | 'Service' | 'Rented';

      const goteborgBikes = [
        // Available bikes
        {
          batteryLevel: 95,
          latitude: 57.7089,
          longitude: 11.9726,
          status: 'Available' as BicycleStatus,
          city: goteborg,
        },
        {
          batteryLevel: 88,
          latitude: 57.7095,
          longitude: 11.9689,
          status: 'Available' as BicycleStatus,
          city: goteborg,
        },
        {
          batteryLevel: 92,
          latitude: 57.7066,
          longitude: 11.9384,
          status: 'Available' as BicycleStatus,
          city: goteborg,
        },
        // Service bikes
        {
          batteryLevel: 15,
          latitude: 57.7,
          longitude: 11.9753,
          status: 'Service' as BicycleStatus,
          city: goteborg,
        },
        {
          batteryLevel: 5,
          latitude: 57.7048,
          longitude: 11.9757,
          status: 'Service' as BicycleStatus,
          city: goteborg,
        },
        {
          batteryLevel: 25,
          latitude: 57.7001,
          longitude: 11.9765,
          status: 'Service' as BicycleStatus,
          city: goteborg,
        },
      ];

      // Karlshamn bikes
      const karlshamnBikes = [
        // Available bikes
        {
          batteryLevel: 90,
          latitude: 56.1708,
          longitude: 14.8631,
          status: 'Available' as BicycleStatus,
          city: karlshamn,
        },
        {
          batteryLevel: 85,
          latitude: 56.1657,
          longitude: 14.8607,
          status: 'Available' as BicycleStatus,
          city: karlshamn,
        },
        {
          batteryLevel: 93,
          latitude: 56.1695,
          longitude: 14.8598,
          status: 'Available' as BicycleStatus,
          city: karlshamn,
        },
        // Service bikes
        {
          batteryLevel: 12,
          latitude: 56.1712,
          longitude: 14.8637,
          status: 'Service' as BicycleStatus,
          city: karlshamn,
        },
        {
          batteryLevel: 8,
          latitude: 56.1659,
          longitude: 14.8612,
          status: 'Service' as BicycleStatus,
          city: karlshamn,
        },
        {
          batteryLevel: 20,
          latitude: 56.1691,
          longitude: 14.8608,
          status: 'Service' as BicycleStatus,
          city: karlshamn,
        },
      ];

      // Jönköping bikes
      const jonkopingBikes = [
        // Available bikes
        {
          batteryLevel: 97,
          latitude: 57.7741,
          longitude: 14.2031,
          status: 'Available' as BicycleStatus,
          city: jonkoping,
        },
        {
          batteryLevel: 89,
          latitude: 57.7843,
          longitude: 14.1617,
          status: 'Available' as BicycleStatus,
          city: jonkoping,
        },
        {
          batteryLevel: 94,
          latitude: 57.7819,
          longitude: 14.1556,
          status: 'Available' as BicycleStatus,
          city: jonkoping,
        },
        // Service bikes
        {
          batteryLevel: 10,
          latitude: 57.7701,
          longitude: 14.2173,
          status: 'Service' as BicycleStatus,
          city: jonkoping,
        },
        {
          batteryLevel: 18,
          latitude: 57.7706,
          longitude: 14.2183,
          status: 'Service' as BicycleStatus,
          city: jonkoping,
        },
        {
          batteryLevel: 7,
          latitude: 57.7696,
          longitude: 14.2183,
          status: 'Service' as BicycleStatus,
          city: jonkoping,
        },
      ];

      await bicycleRepo.save([...goteborgBikes, ...karlshamnBikes, ...jonkopingBikes]);
    }
  }
}

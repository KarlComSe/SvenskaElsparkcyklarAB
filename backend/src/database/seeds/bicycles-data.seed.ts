import { DataSource } from 'typeorm';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';
import { City } from '../../cities/entities/city.entity';

export default class BicycleSeeder {
  async run(connection: DataSource): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const bicycleRepo = connection.getRepository(Bicycle);
      const cityRepo = connection.getRepository(City);

      // keeping debug logs for now
      let goteborg = await cityRepo.findOne({ where: { name: 'Göteborg' } });
      if (!goteborg) {
        // console.log('Creating Göteborg...');
        goteborg = cityRepo.create({ name: 'Göteborg' });
        await cityRepo.save(goteborg);
        // console.log('Göteborg created with ID:', goteborg.id);
      }

      let karlshamn = await cityRepo.findOne({ where: { name: 'Karlshamn' } });
      if (!karlshamn) {
        // console.log('Creating Karlshamn...');
        karlshamn = cityRepo.create({ name: 'Karlshamn' });
        await cityRepo.save(karlshamn);
        // console.log('Karlshamn created with ID:', karlshamn.id);
      }

      let jonkoping = await cityRepo.findOne({ where: { name: 'Jönköping' } });
      if (!jonkoping) {
        // console.log('Creating Jönköping...');
        jonkoping = cityRepo.create({ name: 'Jönköping' });
        await cityRepo.save(jonkoping);
        // console.log('Jönköping created with ID:', jonkoping.id);
      }

      // const cities = await cityRepo.find();
      // console.log('Available cities:', cities);
      // console.log(goteborg)
      // console.log(karlshamn)

      // Add example bicycles
      await bicycleRepo.save([
        {
          batteryLevel: 100,
          latitude: 59.3293,
          longitude: 18.0686,
          status: 'Available',
          city: goteborg,
        },
        {
          batteryLevel: 80,
          latitude: 59.8586,
          longitude: 17.6389,
          status: 'Rented',
          city: karlshamn,
        },
        {
          batteryLevel: 60,
          latitude: 58.4108,
          longitude: 15.6214,
          status: 'Service',
          city: jonkoping,
        },
      ]);
    }
  }
}

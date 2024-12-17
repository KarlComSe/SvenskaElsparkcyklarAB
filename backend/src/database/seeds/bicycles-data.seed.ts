import { DataSource } from 'typeorm';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';
import { City } from 'src/cities/entities/city.entity';

export default class BicycleSeeder {
    async run(connection: DataSource): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            const bicycleRepo = connection.getRepository(Bicycle);
            const cityRepo = connection.getRepository(City);

            // keeping debug logs for now
            let stockholm = await cityRepo.findOne({ where: { name: 'Stockholm' } });
            if (!stockholm) {
                // console.log('Creating Stockholm...');
                stockholm = cityRepo.create({ name: 'Stockholm' });
                await cityRepo.save(stockholm);
                // console.log('Stockholm created with ID:', stockholm.id);
            }

            let uppsala = await cityRepo.findOne({ where: { name: 'Uppsala' } });
            if (!uppsala) {
                // console.log('Creating Uppsala...');
                uppsala = cityRepo.create({ name: 'Uppsala' });
                await cityRepo.save(uppsala);
                // console.log('Uppsala created with ID:', uppsala.id);
            }

            let linkoping = await cityRepo.findOne({ where: { name: 'Linköping' } });
            if (!linkoping) {
                // console.log('Creating Linköping...');
                linkoping = cityRepo.create({ name: 'Linköping' });
                await cityRepo.save(linkoping);
                // console.log('Linköping created with ID:', linkoping.id);
            }

            // const cities = await cityRepo.find();
            // console.log('Available cities:', cities);
            // console.log(stockholm)
            // console.log(uppsala)

            // Add example bicycles
            await bicycleRepo.save([
                {
                    batteryLevel: 100,
                    latitude: 59.3293,
                    longitude: 18.0686,
                    status: 'Available',
                    city: stockholm
                },
                {
                    batteryLevel: 80,
                    latitude: 59.8586,
                    longitude: 17.6389,
                    status: 'Rented',
                    city: uppsala
                },
                {
                    batteryLevel: 60,
                    latitude: 58.4108,
                    longitude: 15.6214,
                    status: 'Service',
                    city: linkoping
                },
            ]);
        }
    }
}

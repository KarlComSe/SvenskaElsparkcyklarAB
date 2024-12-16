import { DataSource } from 'typeorm';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';

export default class BicycleSeeder {
    async run(connection: DataSource): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            const bicycleRepo = connection.getRepository(Bicycle);

            // Add example bicycles
            await bicycleRepo.save([
                {
                    batteryLevel: 100,
                    latitude: 59.3293,
                    longitude: 18.0686,
                    status: 'Available',
                    city: 'Stockholm'
                },
                {
                    batteryLevel: 80,
                    latitude: 59.8586,
                    longitude: 17.6389,
                    status: 'Rented',
                    city: 'Linköping'
                },
                {
                    batteryLevel: 60,
                    latitude: 58.4108,
                    longitude: 15.6214,
                    status: 'Service',
                    city: 'Uppsala'
                },
            ]);
        }
    }
}

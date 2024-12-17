import { DataSource } from 'typeorm';
import { Zone } from '../../zones/entities/zone';
import { City } from '../../cities/entities/city.entity';

export default class ZoneSeeder {
    async run(connection: DataSource): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            const zoneRepo = connection.getRepository(Zone);

            const cityRepo = connection.getRepository(City);

            const cities = await Promise.all([
                cityRepo.findOne({ where: { name: 'Stockholm' } }) || 
                cityRepo.save(cityRepo.create({ name: 'Stockholm' })),
                
                cityRepo.findOne({ where: { name: 'Uppsala' } }) ||
                cityRepo.save(cityRepo.create({ name: 'Uppsala' })),
                
                cityRepo.findOne({ where: { name: 'Linköping' } }) ||
                cityRepo.save(cityRepo.create({ name: 'Linköping' }))
            ]);

            const [stockholm, uppsala, linkoping] = cities;

            // Add example zones
            await zoneRepo.save([
                {
                    polygon: [
                        { lat: 59.3293, lng: 18.0686 },
                        { lat: 59.3298, lng: 18.0687 },
                        { lat: 59.3303, lng: 18.0688 }
                    ],
                    type: 'parking',
                    city: stockholm
                },
                {
                    polygon: [
                        { lat: 59.8586, lng: 17.6389 },
                        { lat: 59.8591, lng: 17.6390 },
                        { lat: 59.8596, lng: 17.6391 }
                    ],
                    type: 'charging',
                    city: uppsala
                },
                {
                    polygon: [
                        { lat: 58.4100, lng: 15.6214 },
                        { lat: 58.4109, lng: 15.6215 },
                        { lat: 58.4115, lng: 15.6216 }
                    ],
                    type: 'speed',
                    city: linkoping,
                    speedZone: {
                        speedLimit: 15
                    }
                }
            ]);
        }
    }
}
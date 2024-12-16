import { DataSource } from 'typeorm';
import { Zone } from '../../zones/entities/zone';

export default class ZoneSeeder {
    async run(connection: DataSource): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            const zoneRepo = connection.getRepository(Zone);

            // Add example zones
            await zoneRepo.save([
                {
                    polygon: [
                        { lat: 59.3293, lng: 18.0686 },
                        { lat: 59.3298, lng: 18.0687 },
                        { lat: 59.3303, lng: 18.0688 }
                    ],
                    type: 'parking',
                    city: 'Stockholm'
                },
                {
                    polygon: [
                        { lat: 59.8586, lng: 17.6389 },
                        { lat: 59.8591, lng: 17.6390 },
                        { lat: 59.8596, lng: 17.6391 }
                    ],
                    type: 'charging',
                    city: 'Uppsala'
                },
                {
                    polygon: [
                        { lat: 58.4100, lng: 15.6214 },
                        { lat: 58.4109, lng: 15.6215 },
                        { lat: 58.4115, lng: 15.6216 }
                    ],
                    type: 'speed',
                    city: 'Linköping',
                    speedZone: {
                        speedLimit: 15
                    }
                }
            ]);
        }
    }
}
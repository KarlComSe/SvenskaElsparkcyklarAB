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
                        { lat: 59.3294, lng: 18.0687 },
                        { lat: 59.3295, lng: 18.0688 }
                    ],
                    type: 'parking'
                },
                {
                    polygon: [
                        { lat: 59.8586, lng: 17.6389 },
                        { lat: 59.8587, lng: 17.6390 },
                        { lat: 59.8588, lng: 17.6391 }
                    ],
                    type: 'charging'
                },
                {
                    polygon: [
                        { lat: 58.4108, lng: 15.6214 },
                        { lat: 58.4109, lng: 15.6215 },
                        { lat: 58.4110, lng: 15.6216 }
                    ],
                    type: 'speed',
                    speedZone: {
                        speedLimit: 15
                    }
                }
            ]);
        }
    }
}
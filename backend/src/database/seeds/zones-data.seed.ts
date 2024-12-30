import { DataSource } from 'typeorm';
import { Zone } from '../../zones/entities/zone';
import { City } from '../../cities/entities/city.entity';

export default class ZoneSeeder {
  async run(connection: DataSource): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const zoneRepo = connection.getRepository(Zone);

      const cityRepo = connection.getRepository(City);

      const cities = await Promise.all([
        cityRepo.findOne({ where: { name: 'Göteborg' } }) ||
          cityRepo.save(cityRepo.create({ name: 'Göteborg' })),

        cityRepo.findOne({ where: { name: 'Karlshamn' } }) ||
          cityRepo.save(cityRepo.create({ name: 'Karlshamn' })),

        cityRepo.findOne({ where: { name: 'Jönköping' } }) ||
          cityRepo.save(cityRepo.create({ name: 'Jönköping' })),
      ]);

      const [goteborg, karlshamn, jonkoping] = cities;
      const [parking, charging, speed] = ['parking', 'charging', 'speed'] as const;

      await zoneRepo.clear();

      // Göteborg Zones
      const gotebergZones = [
        // Central Station Parking Zone
        {
          polygon: [
            { lat: 57.7089, lng: 11.9726 },
            { lat: 57.7092, lng: 11.9734 },
            { lat: 57.7088, lng: 11.9746 },
            { lat: 57.7084, lng: 11.9738 },
            { lat: 57.7089, lng: 11.9726 },
          ],
          type: parking,
          city: goteborg,
          name: 'Central Station P-hus',
        },
        // Nordstan Shopping Center Parking
        {
          polygon: [
            { lat: 57.7095, lng: 11.9689 },
            { lat: 57.7099, lng: 11.9701 },
            { lat: 57.7093, lng: 11.9712 },
            { lat: 57.7089, lng: 11.97 },
            { lat: 57.7095, lng: 11.9689 },
          ],
          type: parking,
          city: goteborg,
          name: 'Nordstan P-hus',
        },
        // Lindholmen Science Park Charging Zone
        {
          polygon: [
            { lat: 57.7066, lng: 11.9384 },
            { lat: 57.7069, lng: 11.939 },
            { lat: 57.7067, lng: 11.9396 },
            { lat: 57.7064, lng: 11.939 },
            { lat: 57.7066, lng: 11.9384 },
          ],
          type: charging,
          city: goteborg,
          name: 'Lindholmen Laddstation',
        },
        // Avenyn Speed Zone
        {
          polygon: [
            { lat: 57.7, lng: 11.9753 },
            { lat: 57.7047, lng: 11.9745 },
            { lat: 57.7048, lng: 11.9757 },
            { lat: 57.7001, lng: 11.9765 },
            { lat: 57.7, lng: 11.9753 },
          ],
          type: speed,
          city: goteborg,
          speedZone: {
            speedLimit: 30,
          },
          name: 'Avenyn Hastighetszon',
        },
      ];

      // Karlshamn Zones
      const karlshamnZones = [
        // City Center Parking
        {
          polygon: [
            { lat: 56.1708, lng: 14.8631 },
            { lat: 56.1712, lng: 14.8637 },
            { lat: 56.1709, lng: 14.8643 },
            { lat: 56.1705, lng: 14.8637 },
            { lat: 56.1708, lng: 14.8631 },
          ],
          type: parking,
          city: karlshamn,
          name: 'Centrum Parkering Karlshamn',
        },
        // Harbor Charging Station
        {
          polygon: [
            { lat: 56.1657, lng: 14.8607 },
            { lat: 56.1659, lng: 14.8612 },
            { lat: 56.1657, lng: 14.8616 },
            { lat: 56.1655, lng: 14.8611 },
            { lat: 56.1657, lng: 14.8607 },
          ],
          type: charging,
          city: karlshamn,
          name: 'Hamnen Laddstation',
        },
        // School Zone Speed Limit
        {
          polygon: [
            { lat: 56.1695, lng: 14.8598 },
            { lat: 56.1699, lng: 14.8608 },
            { lat: 56.1695, lng: 14.8618 },
            { lat: 56.1691, lng: 14.8608 },
            { lat: 56.1695, lng: 14.8598 },
          ],
          type: speed,
          city: karlshamn,
          speedZone: {
            speedLimit: 20,
          },
          name: 'Skolzon Väggaskolan',
        },
      ];

      // Jönköping Zones
      const jonkopingZones = [
        // A6 Shopping Center Parking
        {
          polygon: [
            { lat: 57.7741, lng: 14.2031 },
            { lat: 57.7745, lng: 14.2039 },
            { lat: 57.7741, lng: 14.2047 },
            { lat: 57.7737, lng: 14.2039 },
            { lat: 57.7741, lng: 14.2031 },
          ],
          type: parking,
          city: jonkoping,
          name: 'A6 Center Parkering',
        },
        // Central Station Charging
        {
          polygon: [
            { lat: 57.7843, lng: 14.1617 },
            { lat: 57.7846, lng: 14.1622 },
            { lat: 57.7844, lng: 14.1627 },
            { lat: 57.7841, lng: 14.1622 },
            { lat: 57.7843, lng: 14.1617 },
          ],
          type: charging,
          city: jonkoping,
          name: 'Resecentrum Laddstation',
        },
        // City Center Speed Zone
        {
          polygon: [
            { lat: 57.7819, lng: 14.1556 },
            { lat: 57.7829, lng: 14.1576 },
            { lat: 57.7824, lng: 14.1586 },
            { lat: 57.7814, lng: 14.1566 },
            { lat: 57.7819, lng: 14.1556 },
          ],
          type: speed,
          city: jonkoping,
          speedZone: {
            speedLimit: 30,
          },
          name: 'Centrum Hastighetszon Jönköping',
        },
        // Elmia Exhibition Center Parking
        {
          polygon: [
            { lat: 57.7701, lng: 14.2173 },
            { lat: 57.7706, lng: 14.2183 },
            { lat: 57.7701, lng: 14.2193 },
            { lat: 57.7696, lng: 14.2183 },
            { lat: 57.7701, lng: 14.2173 },
          ],
          type: parking,
          city: jonkoping,
          name: 'Elmia Parkering',
        },
      ];

      // Save all zones
      await zoneRepo.save([...gotebergZones, ...karlshamnZones, ...jonkopingZones]);
    }
  }
}

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Bicycle } from './bicycles/entities/bicycle.entity';
import UserDataSeeder from './database/seeds/user-data.seed';
import BicycleSeeder from './database/seeds/bicycles-data.seed';
import ZoneSeeder from './database/seeds/zones-data.seed';
import TravelSeeder from './database/seeds/travel-data.seed';
import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BicyclesModule } from './bicycles/bicycles.module';
import { ZonesModule } from './zones/zones.module';
import { Zone } from './zones/entities/zone';
import { SpeedZone } from './zones/entities/speed-zone';
import { CitiesModule } from './cities/cities.module';
import { City } from './cities/entities/city.entity';
import { TravelModule } from './travel/travel.module';
import { Travel } from './travel/entities/travel.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? ':memory:' : 'data/db.sqlite',
      entities: [User, Bicycle, Zone, SpeedZone, City, Travel],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BicyclesModule,
    ZonesModule,
    CitiesModule,
    TravelModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      const userSeeder = new UserDataSeeder();
      await userSeeder.run(this.dataSource);
      const bicycleSeeder = new BicycleSeeder();
      await bicycleSeeder.run(this.dataSource);
      const zoneSeeder = new ZoneSeeder();
      await zoneSeeder.run(this.dataSource);
      const travelSeeder = new TravelSeeder();
      await travelSeeder.run(this.dataSource);
    }
  }
}

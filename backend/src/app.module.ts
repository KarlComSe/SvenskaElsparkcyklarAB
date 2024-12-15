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
import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BicyclesModule } from './bicycles/bicycles.module';
import { ZonesModule } from './zones/zones.module';
import { Zone } from './zones/entities/zone';
import { SpeedZone } from './zones/entities/speed-zone';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? ':memory:' : 'db.sqlite',
      entities: [User, Bicycle, Zone, SpeedZone],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BicyclesModule,
    ZonesModule
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
    }
  }
}

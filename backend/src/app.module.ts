import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Type } from 'class-transformer';
import InitialDataSeeder from './database/seeds/initial-data.seed';
import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BicyclesModule } from './bicycles/bicycles.module';
import { ZonesModule } from './zones/zones.module';

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
      entities: [User],
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
      const seeder = new InitialDataSeeder();
      await seeder.run(this.dataSource);
    }
  }
}

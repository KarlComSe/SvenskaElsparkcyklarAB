import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}

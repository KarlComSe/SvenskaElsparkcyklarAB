import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';
import { City } from 'src/cities/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bicycle, City])],
  providers: [BicyclesService],
  controllers: [BicyclesController],
  exports: [BicyclesService],
})
export class BicyclesModule {}

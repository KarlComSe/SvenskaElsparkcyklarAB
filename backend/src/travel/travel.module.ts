import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { BicyclesModule } from '../bicycles/bicycles.module';
import { ZonesModule } from 'src/zones/zones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Travel]), BicyclesModule, ZonesModule],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}

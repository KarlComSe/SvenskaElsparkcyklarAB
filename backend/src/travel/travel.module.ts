import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { BicyclesModule } from '../bicycles/bicycles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Travel]), BicyclesModule],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}

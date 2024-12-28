import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone';
import { SpeedZone } from './entities/speed-zone';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { BicyclesModule } from 'src/bicycles/bicycles.module';


@Module({
  imports: [TypeOrmModule.forFeature([Zone, SpeedZone]), BicyclesModule],
  providers: [ZonesService],
  controllers: [ZonesController],
  exports: [ZonesService],
})
export class ZonesModule {}

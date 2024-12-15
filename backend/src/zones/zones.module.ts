import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone';
import { SpeedZone } from './entities/speed-zone';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
    imports: [TypeOrmModule.forFeature([Zone, SpeedZone])],
    providers: [ZonesService],
    controllers: [ZonesController],
})
export class ZonesModule {}

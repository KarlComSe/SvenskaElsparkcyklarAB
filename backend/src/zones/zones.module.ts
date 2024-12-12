import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone/zone';
import { SpeedZone } from './entities/zone/speed-zone';

@Module({
    imports: [TypeOrmModule.forFeature([Zone, SpeedZone])],
    providers: [],
    controllers: [],
})
export class ZonesModule {}

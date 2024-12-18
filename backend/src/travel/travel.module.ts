import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Travel])],
    controllers: [TravelController],
    providers: [TravelService],
})
export class TravelModule {}

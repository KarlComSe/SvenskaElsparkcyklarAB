import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bicycle } from './entities/bicycle.entity';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';

@Module({
    imports: [TypeOrmModule.forFeature([Bicycle])],
    providers: [BicyclesService],
    controllers: [BicyclesController],
})
export class BicyclesModule {}

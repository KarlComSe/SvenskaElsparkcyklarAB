import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bicycle } from './entities/bicycle/bicycle';

@Module({
    imports: [TypeOrmModule.forFeature([Bicycle])],
    providers: [],
    controllers: [],
})
export class BicyclesModule {}

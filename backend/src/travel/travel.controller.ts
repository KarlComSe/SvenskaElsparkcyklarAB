
import { Controller, Get, Param } from '@nestjs/common';
import { TravelService } from './travel.service';

@Controller('travel')
export class TravelController {
    constructor(private readonly travelService: TravelService) {}

    @Get()
    async getAllTravels() {
        return await this.travelService.findAll();
    }

    @Get(':id')
    async getTravelById(@Param('id') id: number) {
        return await this.travelService.findById(id);
      }
}
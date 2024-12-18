
import { Controller, Get } from '@nestjs/common';
import { TravelService } from './travel.service';

@Controller('travel')
export class TravelController {
    constructor(private readonly travelService: TravelService) {}

    @Get()
    async getAllTravels() {
        return await this.travelService.findAll();
    }
}
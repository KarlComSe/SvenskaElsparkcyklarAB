import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all cities' })
    @ApiResponse({
        status: 200,
        description: 'List of bicycles',
        schema: {
            type: 'array',
            example: [
                {
                    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
                    city: 'Stockholm',
                    latitude: 59.3293,
                    longitude: 18.0686,
                    createdAt: '2024-12-01T05:01:01.000Z',
                    updatedAt: '2024-12-07T18:30:30.000Z',
                },
            ],
        },
    })
    async getAllCities() {
        return await this.citiesService.findAll();
    }
}

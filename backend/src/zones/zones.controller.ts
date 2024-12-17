import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone';

@ApiTags('Zones')
@Controller('zone')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all zones' })
    @ApiResponse({
        status: 200,
        description: 'List of zones',
        schema: {
            type: 'array',
            example: [
                {
                    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
                    polygon: [
                        { lat: 59.3293, lng: 18.0686 },
                        { lat: 59.3294, lng: 18.0687 },
                        { lat: 59.3295, lng: 18.0688 }
                    ],
                    type: 'speed',
                    city: 'Stockholm',
                    speedZone: {
                        id: 'c2f88dd4-0ba9-5f7c-b5d7-c7fc59f59465',
                        speedLimit: 20.5
                    }
                },
                {
                    id: 'd2a77ee5-0fa9-4e7c-a6d7-b7fc59f59466',
                    polygon: [
                        { lat: 59.8586, lng: 17.6389 },
                        { lat: 59.8587, lng: 17.6390 },
                        { lat: 59.8588, lng: 17.6391 }
                    ],
                    type: 'parking',
                    city: 'Stockholm',
                }
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Authentication required',
    })
    async getAllZones(): Promise<Zone[]> {
        return await this.zonesService.findAll();
    }
}
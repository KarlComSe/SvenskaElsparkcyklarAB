import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lon', required: false, type: Number })
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
            { lat: 59.3295, lng: 18.0688 },
          ],
          type: 'speed',
          city: 'Göteborg',
          speedZone: {
            id: 'c2f88dd4-0ba9-5f7c-b5d7-c7fc59f59465',
            speedLimit: 20.5,
          },
        },
        {
          id: 'd2a77ee5-0fa9-4e7c-a6d7-b7fc59f59466',
          polygon: [
            { lat: 59.8586, lng: 17.6389 },
            { lat: 59.8587, lng: 17.639 },
            { lat: 59.8588, lng: 17.6391 },
          ],
          type: 'parking',
          city: 'Göteborg',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  async getAllZones(
    @Query('lat') lat?: number,
    @Query('lon') lon?: number,
  ): Promise<Zone[]> {
    if (lat && lon) {
      console.log('lat:', lat, 'lon:', lon);
      return await this.zonesService.getZones(lat, lon);
    }
    return await this.zonesService.findAll();
  }

  @Get('city/:cityName')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all zones in a specific city' })
  @ApiResponse({
    status: 200,
    description: 'List of zones in the specified city',
    schema: {
      type: 'array',
      example: [
        {
          id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
          polygon: [
            { lat: 59.3293, lng: 18.0686 },
            { lat: 59.3294, lng: 18.0687 },
            { lat: 59.3295, lng: 18.0688 },
          ],
          type: 'speed',
          city: {
            id: 'd2322ff3-a81c-4b06-b78d-1bc72b4fe459',
            name: 'Göteborg',
            latitude: null,
            longitude: null,
            createdAt: '2024-12-17T10:37:25.000Z',
            updatedAt: '2024-12-17T10:37:25.000Z',
          },
          speedZone: {
            id: 'c2f88dd4-0ba9-5f7c-b5d7-c7fc59f59465',
            speedLimit: 20.5,
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  @ApiParam({
    name: 'cityName',
    description: 'Name of the city',
    type: 'string',
    enum: ['Göteborg', 'Jönköping', 'Karlshamn'],
  })
  async getZonesByCity(
    @Param('cityName') cityName: 'Göteborg' | 'Jönköping' | 'Karlshamn',
  ) {
    return await this.zonesService.findByCity(cityName);
  }
}

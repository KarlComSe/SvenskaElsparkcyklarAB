import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Patch,
  Body,
  Query,
  ParseFloatPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BicyclesService } from './bicycles.service';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { Bicycle } from './entities/bicycle.entity';
import { BicycleResponse } from './types/bicycle-response.interface';
import { CreateBicycleDto } from './dto/create-bicycle.dto';

@ApiTags('Bicycles')
@Controller('bike')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bicycles' })
  @ApiQuery({
    name: 'city',
    required: false,
    enum: ['Göteborg', 'Jönköping', 'Karlshamn'],
  })
  @ApiQuery({ name: 'lat', required: false, minimum: -90, maximum: 90 })
  @ApiQuery({ name: 'lon', required: false, minimum: -180, maximum: 180 })
  @ApiQuery({ name: 'radius', required: false, minimum: 0, maximum: 100000 })
  @ApiResponse({
    status: 200,
    description: 'List of bicycles',
    schema: {
      type: 'array',
      example: [
        {
          id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
          batteryLevel: 100,
          latitude: 59.3293,
          longitude: 18.0686,
          status: 'Available',
          city: 'Göteborg',
          createdAt: '2024-12-01T05:01:01.000Z',
          updatedAt: '2024-12-07T18:30:30.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  async getAllBicycles(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
    @Query('city') city?: 'Göteborg' | 'Jönköping' | 'Karlshamn',
  ): Promise<BicycleResponse[]> {
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;
    const radi = radius ? parseFloat(radius) : 3000;

    if ((latitude && !longitude) || (longitude && !latitude)) {
      throw new BadRequestException(
        'Both lat and lon must be provided for location search',
      );
    }

    if (city) {
      if (latitude) {
        return this.bicyclesService.toBicycleResponses(
          await this.bicyclesService.findByCityAndLocation(
            city,
            latitude,
            longitude,
            radi,
          ),
        );
      }
      return this.bicyclesService.toBicycleResponses(
        await this.bicyclesService.findByCity(city),
      );
    }

    if (latitude) {
      return this.bicyclesService.toBicycleResponses(
        await this.bicyclesService.findByLocation(latitude, longitude, radi),
      );
    }

    return this.bicyclesService.toBicycleResponses(
      await this.bicyclesService.findAll(),
    );
  }

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new bicycle' })
  @ApiBody({
    type: CreateBicycleDto,
    description: 'Bicycle creation data',
    required: false,
    schema: {
      example: {
        batteryLevel: 100,
        latitude: null,
        longitude: null,
        status: 'Available',
        city: 'Göteborg'
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Bicycle created successfully',
    schema: {
      example: {
        id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
        batteryLevel: 100,
        latitude: null,
        longitude: null,
        status: 'Available',
        city: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Göteborg',
          latitude: 57.708870,
          longitude: 11.974560,
          createdAt: '2024-12-01T05:01:01.000Z',
          updatedAt: '2024-12-01T05:01:01.000Z'
        },
        createdAt: '2024-12-01T05:01:01.000Z',
        updatedAt: '2024-12-01T05:01:01.000Z',
      },
    },
  })
  async createABike(@Body() createBicycleDto: CreateBicycleDto): Promise<Bicycle> {
    console.log('skapa cykel');
    return await this.bicyclesService.createBike(createBicycleDto);
  }

  @Post('create-many')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create multiple bicycles' })
  @ApiBody({
    type: [CreateBicycleDto],
    description: 'Array of bicycle creation data',
    required: false,
    schema: {
      example: [
        {
          batteryLevel: 100,
          latitude: null,
          longitude: null,
          status: 'Available',
          city: 'Göteborg'
        },
        {
          batteryLevel: 100,
          latitude: null,
          longitude: null,
          status: 'Available',
          city: 'Göteborg'
        },
      ]
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Bicycles created successfully',
    schema: {
      type: 'array',
      example: [
        {
          id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
          batteryLevel: 100,
          latitude: null,
          longitude: null,
          status: 'Available',
          city: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Göteborg',
            latitude: 57.708870,
            longitude: 11.974560,
            createdAt: '2024-12-01T05:01:01.000Z',
            updatedAt: '2024-12-01T05:01:01.000Z'
          },
          createdAt: '2024-12-01T05:01:01.000Z',
          updatedAt: '2024-12-01T05:01:01.000Z',
        },
        {
          id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
          batteryLevel: 100,
          latitude: null,
          longitude: null,
          status: 'Available',
          city: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Göteborg',
            latitude: 57.708870,
            longitude: 11.974560,
            createdAt: '2024-12-01T05:01:01.000Z',
            updatedAt: '2024-12-01T05:01:01.000Z'
          },
          createdAt: '2024-12-01T05:01:01.000Z',
          updatedAt: '2024-12-01T05:01:01.000Z',
        },
      ],
    },
  })
  async createManyBikes(@Body() createBicycleDto: CreateBicycleDto[]): Promise<Bicycle[]> {
    return await this.bicyclesService.createManyBikes(createBicycleDto);
  }

  @Get(':bikeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a bicycle by ID' })
  @ApiParam({
    name: 'bikeId',
    description: 'Unique identifier of the bicycle',
    type: 'string',
    example: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
  })
  @ApiResponse({
    status: 200,
    description: 'Bicycle details retrieved successfully',
    schema: {
      example: {
        id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
        batteryLevel: 100,
        latitude: 59.3293,
        longitude: 18.0686,
        status: 'Available',
        city: 'Göteborg',
        createdAt: '2024-12-01T05:01:01.000Z',
        updatedAt: '2024-12-07T18:30:30.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Bicycle not found',
  })
  async getBikeById(@Param('bikeId') id: string): Promise<Bicycle> {
    return await this.bicyclesService.findById(id);
  }

  @Patch(':bikeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update bicycle by ID' })
  @ApiParam({
    name: 'bikeId',
    description: 'Unique identifier of the bicycle',
    type: 'string',
    example: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
  })
  @ApiBody({
    description: 'Bicycle update details',
    type: UpdateBicycleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Bicycle updated successfully',
    schema: {
      example: {
        id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
        batteryLevel: 85,
        latitude: 59.3294,
        longitude: 18.0687,
        status: 'Service',
        city: 'Göteborg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 404,
    description: 'Bicycle not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  async updateBicycle(
    @Param('bikeId') bikeId: string,
    @Body() updateBicycleDto: UpdateBicycleDto,
  ) {
    return this.bicyclesService.update(bikeId, updateBicycleDto);
  }

  @Get('city/:cityName')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bicycles in a specific city' })
  @ApiResponse({
    status: 200,
    description: 'List of bicycles in the specified city',
    schema: {
      type: 'array',
      example: [
        {
          id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
          batteryLevel: 80,
          latitude: 59.8586,
          longitude: 17.6389,
          status: 'Rented',
          createdAt: '2024-12-17T10:56:43.000Z',
          updatedAt: '2024-12-17T10:56:43.000Z',
          city: {
            id: 'd2322ff3-a81c-4b06-b78d-1bc72b4fe459',
            name: 'Karlshamn',
            latitude: null,
            longitude: null,
            createdAt: '2024-12-17T10:37:25.000Z',
            updatedAt: '2024-12-17T10:37:25.000Z',
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
  async getBicyclesByCity(
    @Param('cityName') cityName: 'Göteborg' | 'Jönköping' | 'Karlshamn',
  ) {
    return await this.bicyclesService.findByCity(cityName);
  }
}

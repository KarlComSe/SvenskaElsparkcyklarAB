import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Body,
  Query,
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
// we have removed all JwtAuthGuards from this route.
//  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BicyclesService } from './bicycles.service';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { Bicycle } from './entities/bicycle.entity';
import { BicycleResponse } from './types/bicycle-response.interface';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { CityName } from 'src/cities/types/city.enum';
import { BatchUpdateBicyclePositionsDto, BicycleBatchResponseDto } from './dto/batch-update.dto';

const BIKE_ID = 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464';
const UNAUTHORIZED_ERROR_MESSAGE = 'Unauthorized. Authentication required';

@ApiTags('Bicycles')
@Controller({ path: 'bike', version: '1' })
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bicycles' })
  @ApiQuery({
    name: 'city',
    required: false,
    enum: CityName,
  })
  @ApiQuery({ name: 'lat', required: false, minimum: -90, maximum: 90 })
  @ApiQuery({ name: 'lon', required: false, minimum: -180, maximum: 180 })
  @ApiQuery({ name: 'radius', required: false, minimum: 0, maximum: 100000 })
  @ApiResponse({
    status: 200,
    description: 'List of bicycles',
    type: [Bicycle],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  async getAllBicycles(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
    @Query('city') city?: CityName,
  ): Promise<BicycleResponse[]> {
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;
    const radi = radius ? parseFloat(radius) : 3000;

    if ((latitude && !longitude) || (longitude && !latitude)) {
      throw new BadRequestException('Both lat and lon must be provided for location search');
    }

    if (city) {
      if (latitude) {
        return this.bicyclesService.toBicycleResponses(
          await this.bicyclesService.findByCityAndLocation(city, latitude, longitude, radi),
        );
      }
      return this.bicyclesService.toBicycleResponses(await this.bicyclesService.findByCity(city));
    }

    if (latitude) {
      return this.bicyclesService.toBicycleResponses(
        await this.bicyclesService.findByLocation(latitude, longitude, radi),
      );
    }

    return this.bicyclesService.toBicycleResponses(await this.bicyclesService.findAll());
  }

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new bicycle' })
  @ApiBody({
    type: CreateBicycleDto,
    description: 'Bicycle creation data',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'Bicycle created successfully',
    type: Bicycle,
  })
  async createABike(@Body() createBicycleDto: CreateBicycleDto): Promise<Bicycle> {
    console.log('skapa cykel');
    return await this.bicyclesService.createBike(createBicycleDto);
  }

  @Post('create-many')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create multiple bicycles',
    description:
      'Creates multiple bicycles in a single request. At least one bicycle must be provided.',
  })
  @ApiBody({
    type: [CreateBicycleDto],
    description: 'Array of bicycle creation data',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Bicycles created successfully',
    type: [Bicycle],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Empty array or invalid bicycle data provided',
  })
  async createManyBikes(@Body() createBicycleDto: CreateBicycleDto[]): Promise<Bicycle[]> {
    if (!createBicycleDto?.length) {
      throw new BadRequestException('At least one bike is required');
    }
    return await this.bicyclesService.createManyBikes(createBicycleDto);
  }

  @Get(':bikeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a bicycle by ID' })
  @ApiParam({
    name: 'bikeId',
    description: 'Unique identifier of the bicycle',
    type: 'string',
    example: BIKE_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'Bicycle details retrieved successfully',
    type: Bicycle,
  })
  @ApiResponse({
    status: 401,
    description: UNAUTHORIZED_ERROR_MESSAGE,
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
    example: BIKE_ID,
  })
  @ApiBody({
    description: 'Bicycle update details',
    type: UpdateBicycleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Bicycle updated successfully',
    type: Bicycle,
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
    description: UNAUTHORIZED_ERROR_MESSAGE,
  })
  async updateBicycle(@Param('bikeId') bikeId: string, @Body() updateBicycleDto: UpdateBicycleDto) {
    return this.bicyclesService.update(bikeId, updateBicycleDto);
  }

  @Patch('/batch/positions')
  @ApiOperation({ summary: 'Update multiple bicycle positions' })
  @ApiResponse({
    status: 200,
    description: 'Bicycle positions updated successfully',
    type: BicycleBatchResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request (Invalid request payload)',
  })
  async updateBatchPositions(
    @Body() dto: BatchUpdateBicyclePositionsDto,
  ): Promise<BicycleBatchResponseDto> {
    const results = await this.bicyclesService.updatePositionsParallel(dto.updates);
    return {
      results,
      totalCount: results.length,
      successCount: results.filter((r) => r.success).length,
      failureCount: results.filter((r) => !r.success).length,
    };
  }

  @Get('city/:cityName')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bicycles in a specific city' })
  @ApiResponse({
    status: 200,
    description: 'List of bicycles in the specified city',
    type: [Bicycle],
  })
  @ApiResponse({
    status: 401,
    description: UNAUTHORIZED_ERROR_MESSAGE,
  })
  @ApiParam({
    name: 'cityName',
    description: 'Name of the city',
    type: 'string',
    enum: CityName,
  })
  async getBicyclesByCity(@Param('cityName') cityName: CityName): Promise<Bicycle[]> {
    return await this.bicyclesService.findByCity(cityName);
  }
}

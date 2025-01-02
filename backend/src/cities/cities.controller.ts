import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CityName } from './types/city.enum';
import { City } from './entities/city.entity';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({
    status: 200,
    description: 'List of bicycles',
    type: [City],
  })
  async getAllCities() {
    return await this.citiesService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({
    status: 201,
    description: 'City created successfully',
    type: City,
  })
  async createACity(@Body() createCityDto: CreateCityDto) {
    return await this.citiesService.createCity(createCityDto);
  }
}

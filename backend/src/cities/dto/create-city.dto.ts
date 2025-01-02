import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { City } from '../entities/city.entity';
import { CityName } from '../types/city.enum';

export class CreateCityDto {
  @ApiProperty({
    enum: CityName,
  })
  @IsEnum(CityName)
  name: CityName;

  @ApiProperty({
    description: 'Latitude coordinate of the city center',
    example: 59.3293,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate of the city center',
    example: 18.0686,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

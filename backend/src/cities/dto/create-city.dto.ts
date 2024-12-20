import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { City } from '../entities/city.entity';

export class CreateCityDto {
  @ApiProperty({
    description: 'City',
    example: 'Göteborg',
    enum: ['Göteborg', 'Jönköping', 'Karlshamn'],
    required: true,
  })
  @IsEnum(['Göteborg', 'Jönköping', 'Karlshamn'])
  name: 'Göteborg' | 'Jönköping' | 'Karlshamn';

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

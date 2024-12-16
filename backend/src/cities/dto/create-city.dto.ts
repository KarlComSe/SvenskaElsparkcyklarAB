import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { City } from '../entities/city.entity';

export class CreateCityDto {
    @ApiProperty({
        description: 'City',
        example: "Stockholm",
        type: City,
        enum: ['Stockholm', 'Linköping', 'Uppsala'],
        required: true,
    })
    name: City;

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
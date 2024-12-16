import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, Min, Max, IsUUID } from 'class-validator';

export class UpdateBicycleDto {
    @ApiProperty({
        description: 'Battery level of the bicycle',
        example: 85,
        type: Number,
        minimum: 0,
        maximum: 100,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    batteryLevel?: number;

    @ApiProperty({
        description: 'Latitude coordinate of the bicycle',
        example: 59.3293,
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiProperty({
        description: 'Longitude coordinate of the bicycle',
        example: 18.0686,
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiProperty({
        description: 'Status of the bicycle',
        example: 'Available',
        enum: ['Rented', 'Available', 'Service'],
        required: false,
    })
    @IsOptional()
    @IsEnum(['Rented', 'Available', 'Service'])
    status?: 'Rented' | 'Available' | 'Service';

    @ApiProperty({
        description: 'City of the bicycle',
        example: 'Linköping',
        enum: ['Stockholm', 'Linköping', 'Uppsala'],
        required: false,
    })
    @IsOptional()
    @IsUUID()
    cityId?: string;
}
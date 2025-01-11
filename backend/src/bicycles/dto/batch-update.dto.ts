import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateBicycleDto } from './update-bicycle.dto';
import { BicycleBatchResponse } from '../types/BicycleBatchResponse';

export class UpdateBicycleWithIdDto extends UpdateBicycleDto {
    @ApiProperty({
        description: 'Unique identifier of the bicycle',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    @IsUUID()
    id: string;
}

export class BicyclePositionDto {
    @ApiProperty({
        description: 'Unique identifier of the bicycle',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        description: 'Latitude coordinate of the bicycle',
        example: 59.3293,
        type: Number,
        required: true,
    })
    @IsNumber()
    latitude: number;

    @ApiProperty({
        description: 'Longitude coordinate of the bicycle',
        example: 18.0686,
        type: Number,
        required: true,
    })
    @IsNumber()
    longitude: number;
}

export class BatchUpdateBicyclePositionsDto {
    @ApiProperty({
        description: 'Array of bicycle position updates',
        type: [BicyclePositionDto],
        required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BicyclePositionDto)
    updates: BicyclePositionDto[];
}

export class BicycleBatchResponseItem {
    @ApiProperty({
        description: 'Unique identifier of the bicycle',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'Whether the update was successful',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Error message if the update failed',
        example: 'Bicycle not found',
        required: false,
    })
    error?: string;
}


export class BicycleBatchResponseDto {
    @ApiProperty({
        type: [BicycleBatchResponseItem],
        description: 'Array of update results',
    })
    results: BicycleBatchResponseItem[];

    @ApiProperty({
        description: 'Total number of updates attempted',
        example: 10,
    })
    totalCount: number;

    @ApiProperty({
        description: 'Number of successful updates',
        example: 8,
    })
    successCount: number;

    @ApiProperty({
        description: 'Number of failed updates',
        example: 2,
    })
    failureCount: number;
}
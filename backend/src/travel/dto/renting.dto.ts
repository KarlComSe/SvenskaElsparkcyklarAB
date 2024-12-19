import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class StartRentingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      description: 'The ID of the bicycle to rent',
      example: 'bike-123',
      required: true
    })
    bikeId: string;
  }

export class TravelResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: 45.4215 })
  latStart: number;

  @ApiProperty({ example: -75.6972 })
  longStart: number;

  @ApiProperty({ enum: ['Free', 'Parking'], example: 'Free' })
  startZoneType: 'Free' | 'Parking';

  @ApiProperty({ enum: ['Free', 'Parking'], example: 'Free' })
  endZoneType: 'Free' | 'Parking';

  @ApiProperty({ example: 0 })
  cost: number;
}
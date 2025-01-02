import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateBicycleDto {
 @ApiProperty({
   description: 'Battery level of the bicycle (0-100)',
   example: 100,
   required: false,
   type: Number,
   default: 100
 })
 @IsNumber()
 @IsOptional()
 batteryLevel?: number;

 @ApiProperty({
   description: 'Latitude coordinate of the bicycle',
   example: 57.70887,
   required: false,
   nullable: true,
   type: Number
 })
 @IsNumber()
 @IsOptional()
 latitude?: number;

 @ApiProperty({
   description: 'Longitude coordinate of the bicycle', 
   example: 11.97456,
   required: false,
   nullable: true,
   type: Number
 })
 @IsNumber()
 @IsOptional()
 longitude?: number;

 @ApiProperty({
   description: 'Status of the bicycle',
   enum: ['Rented', 'Available', 'Service'],
   example: 'Available',
   required: false,
   default: 'Available'
 })
 @IsEnum(['Rented', 'Available', 'Service'])
 @IsOptional()
 status?: 'Rented' | 'Available' | 'Service';

 @ApiProperty({
   description: 'City where the bicycle is located',
   enum: ['Göteborg', 'Jönköping', 'Karlshamn'],
   example: 'Göteborg',
   required: false,
   nullable: true
 })
 @IsEnum(['Göteborg', 'Jönköping', 'Karlshamn'])
 @IsOptional()
 city?: 'Göteborg' | 'Jönköping' | 'Karlshamn';
}
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateBicycleDto {
  @IsNumber()
  @IsOptional()
  batteryLevel?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(['Rented', 'Available', 'Service'])
  @IsOptional()
  status?: 'Rented' | 'Available' | 'Service';

  @IsEnum(['Göteborg', 'Jönköping', 'Karlshamn'])
  @IsOptional()
  city?: 'Göteborg' | 'Jönköping' | 'Karlshamn';
}

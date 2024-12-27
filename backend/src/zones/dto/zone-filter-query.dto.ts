import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class ZoneFilterQueryDto {
    @ApiPropertyOptional({ enum: ['parking', 'charging', 'speed'], description: 'Type of zone' })
    @IsOptional()
    @IsEnum(['parking', 'charging', 'speed'], { message: 'type must be one of parking, charging, speed' })
    type?: 'parking' | 'charging' | 'speed';

    @ApiPropertyOptional({ enum: ['bikes'], description: 'Includes filter for additional options' })
    @IsOptional()
    @IsEnum(['bikes'], { message: 'includes must be bikes' })
    includes?: 'bikes';

    @ApiPropertyOptional({ enum: ['Göteborg', 'Jönköping', 'Karlshamn'], description: 'City filter' })
    @IsOptional()
    @IsEnum(['Göteborg', 'Jönköping', 'Karlshamn'], { message: 'city must be one of Göteborg, Jönköping, Karlshamn' })
    city?: 'Göteborg' | 'Jönköping' | 'Karlshamn';

    // consider custom validation for rad, lat, lon
    // consider range validation for rad and lat, lon
    @ApiPropertyOptional({ description: 'Radius filter' })
    @IsOptional()
    rad?: number;

    @ApiPropertyOptional({ description: 'Latitude filter' })
    @IsOptional()
    lat?: number;

    @ApiPropertyOptional({ description: 'Longitude filter' })
    @IsOptional()
    lon?: number;
}
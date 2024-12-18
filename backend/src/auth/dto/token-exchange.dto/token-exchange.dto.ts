import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenExchangeDto {
  @ApiProperty({
    description: 'GitHub OAuth code to exchange for access token',
    example: 'abc123...',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

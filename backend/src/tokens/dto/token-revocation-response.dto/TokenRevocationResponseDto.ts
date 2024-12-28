import { ApiProperty } from '@nestjs/swagger';

export class TokenRevocationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  revokedCount?: number; // Optional, if you want to include how many tokens were revoked
}

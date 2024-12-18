import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTermsDto {
  @ApiProperty()
  @IsBoolean()
  hasAcceptedTerms: boolean;
}

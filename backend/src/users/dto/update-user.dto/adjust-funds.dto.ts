import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class AdjustFundsDto {
  @ApiProperty({
    description: 'The new balance of the user',
    example: 100.0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'Switch to monthly payment plan',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isMonthlyPayment?: boolean;
}

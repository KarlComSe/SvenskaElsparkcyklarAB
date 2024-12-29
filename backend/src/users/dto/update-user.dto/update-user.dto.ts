import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The roles of the user',
    example: ['admin', 'user'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiProperty({
    description: 'If the user has accepted the terms',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasAcceptedTerms?: boolean;

  @ApiProperty({
    description: 'The balance of the user',
    example: 100,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'If user is on a monthly payment plan',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isMonthlyPayment?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsBoolean, IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The GitHub ID of the user',
    example: '12345',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  githubId?: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

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
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'If the user is on a monthly payment plan',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isMonthlyPayment?: boolean;

  @ApiProperty({
    description: 'The accumulated cost for the user',
    example: 50.75,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  accumulatedCost?: number;

  @ApiProperty({
    description: 'The balance of the user',
    example: 100,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;
}

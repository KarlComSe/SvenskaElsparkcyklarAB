import { IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateUserDto {
    // User details that can be updated
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsArray()
    roles?: string[];

    @IsOptional()
    @IsBoolean()
    hasAcceptedTerms?: boolean;
}

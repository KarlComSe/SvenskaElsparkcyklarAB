import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    user: {
        githubId: string;
        username: string;
        email: string;
        roles: string[];
        hasAcceptedTerms: boolean;
    };
}
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('terms')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update terms acceptance status' })
    async updateTerms(
        @Req() req,
        @Body() updateTermsDto: UpdateTermsDto
    ) {
        return this.usersService.updateTerms(
            req.user.githubId, 
            updateTermsDto.hasAcceptedTerms
        );
    }
}
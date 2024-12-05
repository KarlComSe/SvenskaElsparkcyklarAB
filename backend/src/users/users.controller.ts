import { BadRequestException, Controller, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Patch, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

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
        if (typeof updateTermsDto.hasAcceptedTerms !== 'boolean') {
            throw new BadRequestException('Invalid input');
        }
        console.log(req.user);
        return await this.usersService.updateTerms(
            req.user.githubId, 
            updateTermsDto.hasAcceptedTerms
        );
    }
    // Fetch all customers
    @Get()
    @ApiOperation({ summary: 'Get all customers' })
    async getAllCustomers() {
        // return {userid: "hej1"};
        return await this.usersService.findAll();
    }
    // Fetch a customer by ID
    @Get(':githubId')
    @ApiOperation({ summary: 'Get customer by id' })
    async getCustomerById(@Param('githubId') githubId: string) {
        return await this.usersService.findById(githubId);
    }
    // Update a customer by ID
    @Patch(':githubId')
    @ApiOperation({ summary: 'Update customer by githubId' })
    async updateCustomer(
        @Param('githubId') githubId: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(githubId, updateUserDto);
    }
}
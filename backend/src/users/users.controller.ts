import { BadRequestException, Controller, Param, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Patch, Get, Body, Req, Post, UseGuards, Request } from '@nestjs/common';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { AdjustFundsDto } from './dto/update-user.dto/adjust-funds.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('terms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update terms acceptance status' })
  @ApiBody({
    description: 'The body containing the updated terms acceptance status',
    type: UpdateTermsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Terms acceptance status updated successfully',
    examples: {
      'application/json': {
        summary: 'Example of a successful terms update',
        value: {
          githubId: '12345',
          hasAcceptedTerms: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  async updateTerms(@Req() req, @Body() updateTermsDto: UpdateTermsDto) {
    if (typeof updateTermsDto.hasAcceptedTerms !== 'boolean') {
      throw new BadRequestException('Invalid input');
    }
    // console.log(req.user);
    return await this.usersService.updateTerms(
      req.user.githubId,
      updateTermsDto.hasAcceptedTerms,
    );
  }
  // Fetch all customers
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all customers (Only for admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    examples: {
      'application/json': {
        summary: 'Example of a list of customers',
        value: [
          {
            githubId: '169550',
            username: 'three-musketeers',
            email: 'dasthreemusketörs@student.bth.se',
            roles: ['user'],
            hasAcceptedTerms: false,
            avatarUrl: 'https://avatars.githubusercontent.com/u/169550?v=4',
            createdAt: '2024-12-01T05:01:01.000Z',
            updatedAt: '2024-12-07T18:30:30.000Z',
          },
          {
            githubId: '169550',
            username: 'three-musketeers',
            email: 'dasthreemusketörs@student.bth.se',
            roles: ['user'],
            hasAcceptedTerms: false,
            avatarUrl: 'https://avatars.githubusercontent.com/u/169550?v=4',
            createdAt: '2024-12-01T05:01:01.000Z',
            updatedAt: '2024-12-07T18:30:30.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access required',
  })
  async getAllCustomers() {
    // return {userid: "hej1"};
    return await this.usersService.findAll();
  }
  // Fetch a customer by ID
  @Get(':githubId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer by id (Only for admin)' })
  @ApiResponse({
    status: 200,
    description: 'Customer details returned by id',
    examples: {
      'application/json': {
        summary: 'Example of a customer',
        value: {
          githubId: '169550',
          username: 'three-musketeers',
          email: 'dasthreemusketörs@student.bth.se',
          roles: ['user'],
          hasAcceptedTerms: false,
          avatarUrl: 'https://avatars.githubusercontent.com/u/169550?v=4',
          createdAt: '2024-12-01T05:01:01.000Z',
          updatedAt: '2024-12-07T18:30:30.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access required',
  })
  async getCustomerById(@Param('githubId') githubId: string) {
    return await this.usersService.findById(githubId);
  }
  // Update a customer by ID
  @Patch(':githubId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update customer by githubId (Only for admin)' })
  @ApiParam({
    name: 'githubId',
    description: 'The GitHub ID of the user',
    example: '12345',
  })
  @ApiBody({
    description: 'The body containing the updated user details',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    examples: {
      'application/json': {
        summary: 'Example of a successful customer update',
        value: {
          githubId: '12345',
          email: 'vteam@student.bth.se',
          roles: ['admin'],
          hasAcceptedTerms: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input with error message',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access required',
  })
  async updateCustomer(
    @Param('githubId') githubId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(githubId, updateUserDto);
  }

  @Get(':githubId/account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get account balance and accumulated cost',
    description: 'Returns the users balance and accumulated monthly payment cost.',
  })
  @ApiResponse({
    status: 200,
    description: 'Account details retrieved successfully.',
  })
  async getAccountDetails(@Param('githubId') githubId: string) {
    const user = await this.usersService.findById(githubId);
    return {
      balance: user.balance,
      accumulatedCost: user.accumulatedCost,
      isMonthlyPayment: user.isMonthlyPayment,
    };
  }
  @Post(':githubId/adjust-funds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adjust user balance and payment mode',
    description: 'Set a new balance for the user and optionally toggle monthly payment mode.',
  })
  @ApiResponse({
    status: 200,
    description: 'User balance adjusted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You cannot adjust other users unless you are an admin.',
  })
  async adjustFunds(
    @Param('githubId') githubId: string,
    @Body() adjustFundsDto: AdjustFundsDto,
    @Request() req: any,
  ) {
    const authenticatedUser = req.user;
  
    // Only allow if the user is an admin or adjusting their own account
    if (
      authenticatedUser.githubId !== githubId &&
      !authenticatedUser.roles.includes('admin')
    ) {
      throw new ForbiddenException('You are not allowed to adjust other users\' accounts.');
    }
  
    return await this.usersService.adjustFunds(githubId, adjustFundsDto);
  }
  


}

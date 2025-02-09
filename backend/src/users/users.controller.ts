import {
  BadRequestException,
  Controller,
  Param,
  ForbiddenException,
  Patch,
  Get,
  Body,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateTermsDto } from './dto/update-terms.dto/update-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { AdjustFundsDto } from './dto/update-user.dto/adjust-funds.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { HTTP_STATUS } from '../constants/HTTP_responses';
import {
  ApiAuthResponses,
  ApiAdminResponses,
  ApiBadRequestResponse,
} from 'src/decorators/api-responses.decorator';

export const CustomerExample = {
  githubId: '169550',
  username: 'three-musketeers',
  email: 'dasthreemusketörs@student.bth.se',
  roles: ['user'],
  hasAcceptedTerms: false,
  avatarUrl: 'https://avatars.githubusercontent.com/u/169550?v=4',
  createdAt: '2024-12-01T05:01:01.000Z',
  updatedAt: '2024-12-07T18:30:30.000Z',
} as const;

@Controller({ path: 'users', version: '1' })
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
    status: HTTP_STATUS.OK,
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
  @ApiBadRequestResponse()
  @ApiAuthResponses()
  async updateTerms(@Req() req, @Body() updateTermsDto: UpdateTermsDto) {
    if (typeof updateTermsDto.hasAcceptedTerms !== 'boolean') {
      throw new BadRequestException('Invalid input');
    }
    return await this.usersService.updateTerms(req.user.githubId, updateTermsDto.hasAcceptedTerms);
  }
  // Fetch all customers
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all customers (Only for admin)' })
  @ApiResponse({
    status: HTTP_STATUS.OK,
    description: 'List of customers',
    examples: {
      'application/json': {
        summary: 'Example of a list of customers',
        value: [CustomerExample],
      },
    },
  })
  @ApiAuthResponses()
  @ApiAdminResponses()
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
    status: HTTP_STATUS.OK,
    description: 'Customer details returned by id',
    examples: {
      'application/json': {
        summary: 'Example of a customer',
        value: CustomerExample,
      },
    },
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiAdminResponses()
  @ApiAuthResponses()
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
    status: HTTP_STATUS.OK,
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
    status: HTTP_STATUS.BAD_REQUEST,
    description: 'Invalid input with error message',
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiAdminResponses()
  @ApiAuthResponses()
  async updateCustomer(@Param('githubId') githubId: string, @Body() updateUserDto: UpdateUserDto) {
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
    status: HTTP_STATUS.OK,
    description: 'Account details retrieved successfully.',
  })
  async getAccountDetails(@Param('githubId') githubId: string, @Request() req: any) {
    const user = await this.usersService.findById(githubId);
    const authenticatedUser = req.user;

    // Only allow if the user is an admin or viewing their own account
    if (authenticatedUser.githubId !== githubId && !authenticatedUser.roles.includes('admin')) {
      throw new ForbiddenException("You are not allowed to view other users' accounts.");
    }

    return {
      balance: user.balance,
      accumulatedCost: user.accumulatedCost,
      isMonthlyPayment: user.isMonthlyPayment,
    };
  }
  @Patch(':githubId/adjust-funds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adjust user balance and payment mode',
    description: 'Set a new balance for the user and optionally toggle monthly payment mode.',
  })
  @ApiResponse({
    status: HTTP_STATUS.OK,
    description: 'User balance adjusted successfully',
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND,
    description: 'User not found',
  })
  @ApiAdminResponses()
  async adjustFunds(
    @Param('githubId') githubId: string,
    @Body() adjustFundsDto: AdjustFundsDto,
    @Request() req: any,
  ) {
    const authenticatedUser = req.user;

    // Only allow if the user is an admin or adjusting their own account
    if (authenticatedUser.githubId !== githubId && !authenticatedUser.roles.includes('admin')) {
      throw new ForbiddenException("You are not allowed to adjust other users' accounts.");
    }

    return await this.usersService.adjustFunds(githubId, adjustFundsDto);
  }

  @Patch(':githubId/soft-delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a user (Only for admin - set user role to inactive)' })
  @ApiResponse({
    status: HTTP_STATUS.OK,
    description: 'User soft-deleted successfully',
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND,
    description: 'User not found',
  })
  @ApiAdminResponses()
  async softDeleteUser(@Param('githubId') githubId: string) {
    return await this.usersService.softDeleteUser(githubId);
  }
}

import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenExchangeDto } from './dto/token-exchange.dto/token-exchange.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: 'Exchange GitHub code for access token' })
  @ApiResponse({ status: 200, description: 'Token exchange successful' })
  async exchangeToken(@Body() tokenExchangeDto: TokenExchangeDto) {
    return this.authService.exchangeGithubCode(tokenExchangeDto.code);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Returns user information' })
  async getMe(@Req() req) {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'Returns authentication status' })
  async getStatus(@Req() req) {
    return this.authService.getStatus(req.user);
  }
}

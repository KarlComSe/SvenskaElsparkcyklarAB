import { Controller, Post, UseGuards, Req, Param, Get } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokenResponseDto } from './dto/token-response.dto/token-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenRevocationResponseDto } from './dto/token-revocation-response.dto/TokenRevocationResponseDto';
import { TokenGuard } from './guards/token.guard';

@ApiTags('Tokens')
@Controller({ path: 'tokens', version: '1' })
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new token',
    description: 'Creates a new token for the authenticated user with specified parameters',
  })
  @ApiResponse({
    status: 201,
    description:
      'Maximum number of tokens reached. Please consume an existing token before creating a new one',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid token parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  async create(@Req() req): Promise<TokenResponseDto> {
    const token = await this.tokensService.create(req.user.githubId);

    return {
      token: token.id,
      remainingUses: token.remainingUses,
      expiresAt: token.expiresAt,
    };
  }

  @Post(':id/consume')
  @ApiOperation({
    summary: 'Consume a token',
    description: 'Decrements the remaining uses of a token and returns updated token information',
  })
  @ApiResponse({
    status: 201,
    description: 'Token consumed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Token not found or already expired',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Token has no remaining uses',
  })
  async consume(@Param('id') id: string): Promise<TokenResponseDto> {
    const token = await this.tokensService.consume(id);
    return {
      token: token.id,
      remainingUses: token.remainingUses,
      expiresAt: token.expiresAt,
    };
  }

  @ApiOperation({
    summary: 'Protected route example',
    description: 'This route requires a valid API token',
  })
  @ApiHeader({
    name: 'x-api-token',
    description: 'API Token for route access',
    required: true,
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 200,
    description: 'Route accessed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Access granted' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Token is required' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @UseGuards(TokenGuard)
  @Get('protected-route')
  async someProtectedRoute() {
    const insights = [
      "Believe you can and you're halfway there.",
      'The only way to do great work is to love what you do.',
      'Success is not the key to happiness. Happiness is the key to success.',
      "Your time is limited, don't waste it living someone else's life.",
      'The best way to predict the future is to invent it.',
      "Don't watch the clock; do what it does. Keep going.",
      'Keep your face always toward the sunshine—and shadows will fall behind you.',
      'The only limit to our realization of tomorrow is our doubts of today.',
      'The future belongs to those who believe in the beauty of their dreams.',
      'It does not matter how slowly you go as long as you do not stop.',
      'Act as if what you do makes a difference. It does.',
      'Success usually comes to those who are too busy to be looking for it.',
      "Don't be afraid to give up the good to go for the great.",
      'I find that the harder I work, the more luck I seem to have.',
      'Success is not in what you have, but who you are.',
      'The way to get started is to quit talking and begin doing.',
      "Don't let yesterday take up too much of today.",
      "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
      "It's not whether you get knocked down, it's whether you get up.",
      "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];

    return {
      message: `Access granted! Woho, you have just consumed 1 token! Here's a life insight for you: ${randomInsight}`,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get token information',
    description: 'Retrieves detailed information about a specific token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token information retrieved successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  async findOne(@Param('id') id: string): Promise<TokenResponseDto> {
    const token = await this.tokensService.findOne(id);
    return {
      token: token.id,
      remainingUses: token.remainingUses,
      expiresAt: token.expiresAt,
    };
  }

  @Post('/revoke/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Revoke all tokens for a user',
    description: 'Revokes all tokens for a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens revoked successfully',
    type: TokenRevocationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  async revokeAllForUser(@Req() req): Promise<TokenRevocationResponseDto> {
    const result = await this.tokensService.revokeAllForUser(req.user.githubId);
    return {
      success: true,
      message: 'All tokens have been revoked successfully',
      revokedCount: result.affected, // If you want to include this information
    };
  }
}

import { Controller, Post, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokenResponseDto } from './dto/token-response.dto/token-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tokens')
@Controller({ path: 'tokens', version: '2' }) // Version 2
export class TokensV2Controller {
  constructor(private readonly tokensService: TokensService) {}

  @Post(':id/consume')
  @ApiOperation({
    summary: 'Consume a token (v2)',
    description: 'Consumes a token and provides an insight quote from a single person.',
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

    const rooseveltQuotes = [
      "Believe you can and you're halfway there.",
      'Do what you can, with what you have, where you are.',
      'It is hard to fail, but it is worse never to have tried to succeed.',
      'Keep your eyes on the stars, and your feet on the ground.',
      'In any moment of decision, the best thing you can do is the right thing.',
      'The only man who never makes mistakes is the man who never does anything.',
      'Courage is not having the strength to go on; it is going on when you don’t have the strength.',
      'Far better it is to dare mighty things than to rank with those timid souls who neither enjoy much nor suffer much.',
      'People don’t care how much you know until they know how much you care.',
      'Do what you can, with what you’ve got, where you are.',
    ];

    const randomQuote = rooseveltQuotes[Math.floor(Math.random() * rooseveltQuotes.length)];

    return {
      token: token.id,
      remainingUses: token.remainingUses,
      expiresAt: token.expiresAt,
      message: `This is a v2 response: Here's a quote from Theodore Roosevelt: "${randomQuote}"`,
    };
  }
}

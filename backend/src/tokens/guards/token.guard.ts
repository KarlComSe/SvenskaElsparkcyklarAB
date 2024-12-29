import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokensService } from '../tokens.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const tokenId = request.headers['x-api-token'];

    if (!tokenId) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      await this.tokensService.consume(tokenId);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}

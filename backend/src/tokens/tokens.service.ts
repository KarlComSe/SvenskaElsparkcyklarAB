import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity/token.entity';

const DEFAULT_MAX_USES = 10;
const DEFAULT_EXPIRATION_HOURS = 24;

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async create(userId: string): Promise<Token> {
    const existingTokens = await this.tokenRepository.find({
      where: { customerId: userId },
    });
    const existingTokensRemainingUses = existingTokens.filter(
      (token) => token.remainingUses > 0,
    );

    if (existingTokens.length >= 5 && existingTokensRemainingUses.length > 0) {
      throw new BadRequestException(
        'Maximum number of tokens reached. Please consume an existing token before creating a new one.',
      );
    }

    if (existingTokens.length >= 5) {
      throw new BadRequestException('Maximum number of tokens reached');
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + DEFAULT_EXPIRATION_HOURS);
    const token = this.tokenRepository.create({
      customerId: userId,
      remainingUses: DEFAULT_MAX_USES,
      maxUses: DEFAULT_MAX_USES,
      expiresAt: expiresAt,
    });

    return this.tokenRepository.save(token);
  }

  async consume(id: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({ where: { id } });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    if (token.remainingUses <= 0) {
      throw new BadRequestException('Token has no remaining uses');
    }

    if (token.expiresAt && token.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    token.remainingUses--;
    return this.tokenRepository.save(token);
  }

  async findOne(id: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return token;
  }

  revokeAllForUser(githubId: any) {
    return this.tokenRepository.delete({ customerId: githubId });
  }
}

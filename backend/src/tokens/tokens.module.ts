import { Global, Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity/token.entity';
import { TokenGuard } from './guards/token.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService, TokenGuard],
  controllers: [TokensController],
  exports: [TokensService, TokenGuard],
})
export class TokensModule {}

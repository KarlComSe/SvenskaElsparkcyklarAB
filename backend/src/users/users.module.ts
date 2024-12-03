import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])  // This registers the User repository
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]  // Export if other modules need to use UsersService
})
export class UsersModule {}
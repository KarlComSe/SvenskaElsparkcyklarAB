import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async updateTerms(githubId: string, hasAcceptedTerms: boolean): Promise<User> {
        const user = await this.userRepository.findOne({ 
            where: { githubId } 
        });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.hasAcceptedTerms = hasAcceptedTerms;
        return this.userRepository.save(user);
    }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

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
    // Find all customers
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    // Find a customer by ID
    async findById(githubId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { githubId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    // Update customer fields
    async update(githubId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findById(githubId);

        // Check if its allowed in user-dto
        if (updateUserDto.email) user.email = updateUserDto.email;
        if (updateUserDto.roles) user.roles = updateUserDto.roles;
        if (updateUserDto.hasAcceptedTerms !== undefined) {
            user.hasAcceptedTerms = updateUserDto.hasAcceptedTerms;
        }

        return this.userRepository.save(user);
    }
}
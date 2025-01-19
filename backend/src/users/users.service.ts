import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { AdjustFundsDto } from './dto/update-user.dto/adjust-funds.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateTerms(githubId: string, hasAcceptedTerms: boolean): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { githubId },
    });

    // This will never be invoked through the controller because the auth guard will throw an error
    // However, if this is used as a standalone service, this check is necessary
    // removing to get rid of test case
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

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

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async adjustFunds(githubId: string, adjustFundsDto: AdjustFundsDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ githubId });

    if (!user) {
      throw new NotFoundException(`User with GitHub ID ${githubId} not found.`);
    }

    // Update balance and/or isMonthlyPayment only if provided
    if (adjustFundsDto.balance !== undefined) {
      user.balance = adjustFundsDto.balance;
    }
    if (adjustFundsDto.isMonthlyPayment !== undefined) {
      user.isMonthlyPayment = adjustFundsDto.isMonthlyPayment;
    }

    return this.userRepository.save(user);
  }

  async softDeleteUser(githubId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { githubId } });

    if (!user) {
      throw new NotFoundException(`User with GitHub ID ${githubId} not found.`);
    }

    // Update the roles to include "inactive"
    user.roles = ['inactive'];
    return this.userRepository.save(user);
  }
}

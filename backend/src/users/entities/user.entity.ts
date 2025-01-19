import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: '169550', description: 'GitHub user ID' })
  @PrimaryColumn()
  githubId: string;

  @ApiProperty({ example: 'three-musketeers', description: 'GitHub username' })
  @Column()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    nullable: true,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    example: ['user'],
    description: 'User roles',
    default: ['user'],
  })
  @Column('simple-array', { default: '["user"]' })
  roles: string[];

  @ApiProperty({
    example: false,
    description: 'Whether user has accepted terms',
    default: false,
  })
  @Column({ default: false })
  hasAcceptedTerms: boolean;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/169550?v=4',
    description: 'GitHub avatar URL',
    nullable: true,
  })
  @Column({ nullable: true })
  avatarUrl: string;

  @ApiProperty({
    example: '2024-12-01T05:01:01.000Z',
    description: 'Account creation timestamp',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-12-07T18:30:30.000Z',
    description: 'Last update timestamp',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: true,
    description: 'Monthly payment status',
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  isMonthlyPayment: boolean;

  @ApiProperty({
    example: 0,
    description: 'Accumulated cost',
    default: 0,
  })
  @Column({ type: 'decimal', default: 0 })
  accumulatedCost: number;

  @ApiProperty({
    example: 0,
    description: 'Current balance',
    default: 0,
  })
  @Column({ type: 'decimal', default: 0 })
  balance: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

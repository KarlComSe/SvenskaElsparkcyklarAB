import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  githubId: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column('simple-array', { default: '["user"]' })
  roles: string[];

  @Column({ default: false })
  hasAcceptedTerms: boolean;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isMonthlyPayment: boolean;

  @Column({ type: 'decimal', default: 0 })
  accumulatedCost: number;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  customer: User;

  @Column()
  customerId: string;

  @Column()
  remainingUses: number;

  @Column()
  maxUses: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUsedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}

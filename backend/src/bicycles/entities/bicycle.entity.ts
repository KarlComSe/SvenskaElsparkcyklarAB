import { City } from '../../cities/entities/city.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Bicycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 100 })
  batteryLevel: number;

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @Column({
    type: 'simple-enum',
    enum: ['Rented', 'Available', 'Service'],
    default: 'Available',
  })
  status: 'Rented' | 'Available' | 'Service';

  // maybe we should allow nullable here
  @ManyToOne(() => City, { nullable: true })
  @JoinColumn()
  city: City;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

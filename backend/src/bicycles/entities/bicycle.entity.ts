import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Unique identifier of the bicycle',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Battery level of the bicycle (0-100)',
    example: 100,
    default: 100,
    type: Number
  })
  @Column({ type: 'int', default: 100 })
  batteryLevel: number;

  @ApiProperty({
    description: 'Latitude coordinate of the bicycle',
    example: 57.70887,
    required: false,
    nullable: true,
    type: Number
  })
  @Column('float', { nullable: true })
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate of the bicycle',
    example: 11.97456,
    required: false,
    nullable: true,
    type: Number
  })
  @Column('float', { nullable: true })
  longitude?: number;

  @ApiProperty({
    description: 'Current status of the bicycle',
    enum: ['Rented', 'Available', 'Service'],
    default: 'Available',
    example: 'Available'
  })
  @Column({
    type: 'simple-enum',
    enum: ['Rented', 'Available', 'Service'],
    default: 'Available',
  })
  status: 'Rented' | 'Available' | 'Service';

  @ApiProperty({
    description: 'City where the bicycle is located',
    type: () => City,
    required: false,
    nullable: true
  })
  @ManyToOne(() => City, { nullable: true })
  @JoinColumn()
  city: City;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-02T12:10:00Z',
    nullable: true
  })

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-02T12:10:00Z',
    nullable: true
  })
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CityName } from '../types/city.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class City {
  @ApiProperty({
    description: 'Unique identifier of the city',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the city',
    enum: CityName,
    example: CityName.Göteborg,
  })
  @Column({
    type: 'simple-enum',
    enum: CityName,
    default: CityName.Göteborg,
    unique: true,
  })
  name: CityName;

  @ApiProperty({
    description: 'Latitude coordinate of the city',
    example: 57.70887,
    required: false,
    nullable: true,
  })
  @Column('float', { nullable: true })
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate of the city',
    example: 11.97456,
    required: false,
    nullable: true,
  })
  @Column('float', { nullable: true })
  longitude?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-02T12:00:00Z',
  })
  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-02T12:00:00Z',
  })
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

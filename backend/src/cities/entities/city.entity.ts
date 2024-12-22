import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'simple-enum',
    enum: ['Göteborg', 'Jönköping', 'Karlshamn'],
    default: 'Göteborg',
    unique: true,
  })
  name: 'Göteborg' | 'Jönköping' | 'Karlshamn';

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

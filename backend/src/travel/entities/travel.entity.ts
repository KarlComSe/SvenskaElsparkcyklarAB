import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bicycle } from '../../bicycles/entities/bicycle.entity';
import { User } from '../../users/entities/user.entity';

@Entity('travels')
export class Travel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Bicycle, (bicycle) => bicycle.id, { eager: true, nullable: false })
    bike: Bicycle;

    @Column({ nullable: true })
    startTime?: Date;

    @Column('float', { nullable: true })
    latStart?: number;

    @Column('float', { nullable: true })
    longStart?: number;

    @Column({ nullable: true })
    stopTime?: Date;

    @Column('float', { nullable: true })
    latStop?: number;
  
    @Column('float', { nullable: true })
    longStop?: number;

    @ManyToOne(() => User, (user) => user.githubId, { eager: true, nullable: false })
    customer: User;

    @Column('float', { nullable: true })
    cost: number;

    @Column({ type: 'simple-enum', enum: ['Free', 'Parking'], nullable: false })
    startZoneType: 'Free' | 'Parking';

    @Column({ type: 'simple-enum', enum: ['Free', 'Parking'], nullable: true })
    endZoneType: 'Free' | 'Parking';

    @CreateDateColumn({ nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;
}

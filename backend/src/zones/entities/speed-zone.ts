import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Zone } from './zone';

@Entity()
export class SpeedZone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Zone, (zone) => zone.speedZone)
    zone: Zone;

    @Column({ type: 'float' })
    speedLimit: number;
}
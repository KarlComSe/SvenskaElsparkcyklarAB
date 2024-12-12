import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Zone } from './zone';

@Entity()
export class SpeedZone {
    @PrimaryGeneratedColumn('uuid')
    id: string; // Unique identifier

    @OneToOne(() => Zone, (zone) => zone.speedZone)
    zone: Zone; // Foreign key relation to Zone

    @Column({ type: 'float' })
    speedLimit: number; // Speed limit for this speed zone
}

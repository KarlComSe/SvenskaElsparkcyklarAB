import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { SpeedZone } from './speed-zone';

@Entity()
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('json')
    polygon: { lat: number; lng: number }[];

    @Column({ type: 'enum', enum: ['parking', 'charging', 'speed'] })
    type: 'parking' | 'charging' | 'speed'; // Zone type

    @OneToOne(() => SpeedZone, (speedZone) => speedZone.zone, { nullable: true, cascade: true })
    @JoinColumn()
    speedZone?: SpeedZone;
}

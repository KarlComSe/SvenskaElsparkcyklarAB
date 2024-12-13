import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { SpeedZone } from './speed-zone';

@Entity()
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('simple-json')  // Change from 'json' to 'simple-json' for SQLite compatibility
    polygon: { lat: number; lng: number }[];

    @Column({ type: 'simple-enum', enum: ['parking', 'charging', 'speed'] })
    type: 'parking' | 'charging' | 'speed';

    @OneToOne(() => SpeedZone, (speedZone) => speedZone.zone, { 
        nullable: true, 
        cascade: true,
        eager: true  // This will automatically load the speedZone
    })
    @JoinColumn()
    speedZone?: SpeedZone;
}
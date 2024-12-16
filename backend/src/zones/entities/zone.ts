import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { SpeedZone } from './speed-zone';

@Entity()
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('simple-json')
    polygon: { lat: number; lng: number }[];

    @Column({ type: 'simple-enum', enum: ['parking', 'charging', 'speed'] })
    type: 'parking' | 'charging' | 'speed';

    @Column({ type: 'simple-enum', enum: ['Stockholm', 'Linköping', 'Uppsala'] })
    city: 'Stockholm' | 'Linköping' | 'Uppsala';

    @OneToOne(() => SpeedZone, (speedZone) => speedZone.zone, { 
        nullable: true, 
        cascade: true,
        eager: true  // Automatically load the speedZone
    })
    @JoinColumn()
    speedZone?: SpeedZone;
}
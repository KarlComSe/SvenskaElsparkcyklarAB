import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { SpeedZone } from './speed-zone';
import { City } from '../../cities/entities/city.entity';

@Entity()
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('simple-json')
    polygon: { lat: number; lng: number }[];

    @Column({ type: 'simple-enum', enum: ['parking', 'charging', 'speed'] })
    type: 'parking' | 'charging' | 'speed';

    @ManyToOne(() => City, { nullable: false })
    @JoinColumn()
    city: City;

    @OneToOne(() => SpeedZone, (speedZone) => speedZone.zone, { 
        nullable: true, 
        cascade: true,
        eager: true  // Automatically load the speedZone
    })
    @JoinColumn()
    speedZone?: SpeedZone;
}
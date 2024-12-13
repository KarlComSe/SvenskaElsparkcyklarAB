import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Bicycle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', default: 100 })
    batteryLevel: number;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @Column({ default: true })
    available: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

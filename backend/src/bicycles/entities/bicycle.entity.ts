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

    @Column({
        type: 'simple-enum',
        enum: ['Rented', 'Available', 'Service'],
        default: 'Available',
    })
    status: 'Rented' | 'Available' | 'Service';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

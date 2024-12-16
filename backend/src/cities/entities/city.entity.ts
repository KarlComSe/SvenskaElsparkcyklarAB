import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class City {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        type: 'simple-enum', 
        enum: ['Stockholm', 'Linköping', 'Uppsala'], 
        default: 'Stockholm',
        unique: true
    })
    name: 'Stockholm' | 'Linköping' | 'Uppsala';

    @Column('float', { nullable: true })
    latitude?: number;
    longitude?: number;

    @CreateDateColumn({ nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;
}

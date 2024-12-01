import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryColumn()
    githubId: string;

    @Column()
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column('simple-array', { default: '["user"]' })
    roles: string[];

    @Column({ default: false })
    hasAcceptedTerms: boolean;

    @Column({ nullable: true })
    avatarUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
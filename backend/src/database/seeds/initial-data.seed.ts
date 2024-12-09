// src/database/seeds/initial-data.seed.ts
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export default class InitialDataSeeder {
    async run(connection: DataSource): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            const userRepo = connection.getRepository(User);
            
            // Add example admin and test users
            await userRepo.save([
                {
                    githubId: 'Pbris',
                    username: 'Pbris',
                    email: 'pbris@example.com',
                    roles: ['admin'],
                    hasAcceptedTerms: true
                },
                {
                    githubId: 'airhelios',
                    username: 'airhelios',
                    email: 'airhelios@example.com',
                    roles: ['admin'],
                    hasAcceptedTerms: true
                },
                {
                    githubId: 'KarlComSe',
                    username: 'KarlComSe',
                    email: 'karlcomse@example.com',
                    roles: ['admin'],
                    hasAcceptedTerms: true
                },
                {
                    githubId: 'gumme1',
                    username: 'gumme1',
                    email: 'gumme1@example.com',
                    roles: ['admin'],
                    hasAcceptedTerms: true
                },
                {
                    githubId: '123456789', 
                    username: 'johndoe', 
                    email: 'john@example.com', 
                    roles: ['user'], 
                    hasAcceptedTerms: true, 
                    avatarUrl: 'https://example.com/john.jpg'
                },
                {
                    githubId: '234567890', 
                    username: 'janedoe', 
                    email: 'jane@example.com', 
                    roles: ['user', 'admin'], 
                    hasAcceptedTerms: true, 
                    avatarUrl: 'https://example.com/jane.jpg'
                },
                {
                    githubId: '345678901', 
                    username: 'bobsmith', 
                    email: 'bob@example.com', 
                    roles: ['user'], 
                    hasAcceptedTerms: false, 
                    avatarUrl: 'https://example.com/bob.jpg'
                }
            ]);
        }
    }
}
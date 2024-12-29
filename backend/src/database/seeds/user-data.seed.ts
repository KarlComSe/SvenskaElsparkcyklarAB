import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export default class UserDataSeeder {
  async run(connection: DataSource): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const userRepo = connection.getRepository(User);

      // Add example admin and test users
      await userRepo.save([
        {
          githubId: '149484382',
          username: 'Pbris',
          email: 'pbris@example.com',
          roles: ['admin'],
          hasAcceptedTerms: true,
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '149296874',
          username: 'airhelios',
          email: 'airhelios@example.com',
          roles: ['admin'],
          hasAcceptedTerms: true,
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '13668660',
          username: 'KarlComSe',
          email: 'karlcomse@example.com',
          roles: ['admin'],
          hasAcceptedTerms: true,
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '149683406',
          username: 'gumme1',
          email: 'gumme1@example.com',
          roles: ['admin'],
          hasAcceptedTerms: true,
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '123456789',
          username: 'johndoe',
          email: 'john@example.com',
          roles: ['user'],
          hasAcceptedTerms: true,
          avatarUrl: 'https://example.com/john.jpg',
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '234567890',
          username: 'janedoe',
          email: 'jane@example.com',
          roles: ['user', 'admin'],
          hasAcceptedTerms: true,
          avatarUrl: 'https://example.com/jane.jpg',
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
        {
          githubId: '345678901',
          username: 'bobsmith',
          email: 'bob@example.com',
          roles: ['user'],
          hasAcceptedTerms: false,
          avatarUrl: 'https://example.com/bob.jpg',
          isMonthlyPayment: true,
          accumulatedCost: 0,
        },
      ]);
    }
  }
}
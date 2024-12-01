import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private httpService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, httpService: HttpService, configService: ConfigService);
    exchangeGithubCode(code: string): Promise<{
        access_token: string;
        user: {
            githubId: string;
            username: string;
            email: string;
            roles: string[];
            hasAcceptedTerms: boolean;
        };
    }>;
    private getGithubToken;
    private getGithubUser;
    private findOrCreateUser;
    private createToken;
    validateUserById(githubId: string): Promise<User | null>;
    getStatus(user: User): Promise<{
        isAuthenticated: boolean;
        user: {
            githubId: string;
            username: string;
            email: string;
            roles: string[];
            hasAcceptedTerms: boolean;
        };
    }>;
}

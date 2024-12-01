import { JwtService } from '@nestjs/jwt';
interface GithubUser {
    id: string;
    username: string;
    email: string;
    accessToken: string;
}
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    verifyToken(token: string): Promise<any>;
    login(user: GithubUser): Promise<{
        access_token: string;
        user: GithubUser;
    }>;
    validateToken(token: string): Promise<any>;
}
export {};

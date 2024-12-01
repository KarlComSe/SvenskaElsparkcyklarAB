import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    githubLogin(): Promise<void>;
    githubLoginCallback(req: any): Promise<AuthResponse>;
    authStatus(req: any): Promise<{
        isAuthenticated: boolean;
        user: any;
        message: string;
        timestamp: string;
    }>;
    me(req: any): Promise<any>;
    verifyToken(auth: string): Promise<any>;
}

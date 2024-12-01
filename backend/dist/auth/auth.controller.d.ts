import { AuthService } from './auth.service';
import { TokenExchangeDto } from './dto/token-exchange.dto/token-exchange.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    exchangeToken(tokenExchangeDto: TokenExchangeDto): Promise<{
        access_token: string;
        user: {
            githubId: string;
            username: string;
            email: string;
            roles: string[];
            hasAcceptedTerms: boolean;
        };
    }>;
    getMe(req: any): Promise<any>;
    getStatus(req: any): Promise<{
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

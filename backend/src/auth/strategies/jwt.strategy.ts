import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {
        // const secret = process.env.JWT_SECRET || 'your-secret-key';
        // console.log('JwtStrategy initialized with secret:', secret);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        // this is not stateless, as we query the db. This can be refactored to be stateless, the token contains all user data.
        const user = await this.authService.validateUserById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
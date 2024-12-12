import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // console.log('JwtAuthGuard - checking token');
        const request = context.switchToHttp().getRequest();
        // console.log('Headers:', request.headers);
        return super.canActivate(context);
    }
}
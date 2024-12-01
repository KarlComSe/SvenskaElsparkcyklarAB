"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        console.log('AuthService constructor');
    }
    async verifyToken(token) {
        try {
            const actualToken = token.replace('Bearer ', '');
            const decoded = await this.jwtService.verifyAsync(actualToken);
            console.log('Token verified successfully:', decoded);
            return decoded;
        }
        catch (error) {
            console.log('Token verification failed:', error);
            throw error;
        }
    }
    async login(user) {
        const secret = process.env.JWT_SECRET;
        console.log('Secret in AuthService:', secret);
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email
        };
        console.log('Generated JWT payload:', payload);
        const access_token = this.jwtService.sign(payload);
        console.log('Generated JWT token:', access_token);
        return {
            access_token,
            user: user
        };
    }
    async validateToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload;
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
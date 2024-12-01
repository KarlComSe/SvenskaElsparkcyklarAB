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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, httpService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.configService = configService;
    }
    async exchangeGithubCode(code) {
        console.log('Attempting exchange with code:', code);
        console.log('Using client ID:', this.configService.get('OAUTH_CLIENT_ID'));
        const githubToken = await this.getGithubToken(code);
        const githubUser = await this.getGithubUser(githubToken);
        const user = await this.findOrCreateUser(githubUser);
        const token = this.createToken(user);
        return {
            access_token: token,
            user: {
                githubId: user.githubId,
                username: user.username,
                email: user.email,
                roles: user.roles,
                hasAcceptedTerms: user.hasAcceptedTerms
            }
        };
    }
    async getGithubToken(code) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://github.com/login/oauth/access_token', {
            client_id: this.configService.get('OAUTH_CLIENT_ID'),
            client_secret: this.configService.get('OAUTH_CLIENT_SECRET'),
            code,
        }, {
            headers: { Accept: 'application/json' }
        }));
        return data.access_token;
    }
    async getGithubUser(token) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        }));
        return data;
    }
    async findOrCreateUser(githubUser) {
        let user = await this.userRepository.findOne({
            where: { githubId: githubUser.id }
        });
        if (!user) {
            user = await this.userRepository.save(new user_entity_1.User({
                githubId: githubUser.id,
                username: githubUser.login,
                email: githubUser.email,
                avatarUrl: githubUser.avatar_url,
                roles: ['user']
            }));
        }
        return user;
    }
    createToken(user) {
        const payload = {
            sub: user.githubId,
            username: user.username,
            email: user.email,
            roles: user.roles
        };
        return this.jwtService.sign(payload);
    }
    async validateUserById(githubId) {
        return this.userRepository.findOne({ where: { githubId } });
    }
    async getStatus(user) {
        return {
            isAuthenticated: true,
            user: {
                githubId: user.githubId,
                username: user.username,
                email: user.email,
                roles: user.roles,
                hasAcceptedTerms: user.hasAcceptedTerms
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        axios_1.HttpService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
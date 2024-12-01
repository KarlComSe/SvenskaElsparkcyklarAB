"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let AuthExceptionFilter = class AuthExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.log('Auth Error:', {
            path: request.url,
            headers: request.headers,
            error: exception.message
        });
        response
            .status(401)
            .json({
            statusCode: 401,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: 'Unauthorized'
        });
    }
};
exports.AuthExceptionFilter = AuthExceptionFilter;
exports.AuthExceptionFilter = AuthExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.UnauthorizedException)
], AuthExceptionFilter);
//# sourceMappingURL=auth.exception.filter.js.map
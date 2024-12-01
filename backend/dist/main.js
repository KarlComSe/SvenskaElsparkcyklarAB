"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const auth_exception_filter_1 = require("./auth.exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new auth_exception_filter_1.AuthExceptionFilter());
    app.enableCors({
        origin: 'http://localhost:3535',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Svenska Elsparkcyklar API')
        .setDescription('The bike rental API')
        .setVersion('1.0')
        .addTag('bikes')
        .addOAuth2({
        type: 'oauth2',
        flows: {
            authorizationCode: {
                authorizationUrl: 'https://github.com/login/oauth/authorize',
                tokenUrl: 'https://github.com/login/oauth/access_token',
                scopes: {
                    'user:email': 'Read user email addresses',
                }
            }
        }
    })
        .addBearerAuth()
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey
    };
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config, options);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    await app.listen(process.env.PORT ?? 3535);
}
bootstrap();
//# sourceMappingURL=main.js.map
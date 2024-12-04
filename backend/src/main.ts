import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Svenska Elsparkcyklar API')
    .setDescription('API for bike rental service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    app.enableCors({
      origin: [
        'http://localhost:5173',    // Frontend
        `http://localhost:3535${process.env.PORT ?? 3000}`,    // Swagger UI
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

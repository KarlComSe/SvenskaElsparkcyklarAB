import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    // Note global validation pipe
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Svenska Elsparkcyklar API')
    .setDescription('API for bike rental service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend
      'http://localhost:1337', // kundapp
      'http://localhost:3000', // kundapp
      'http://localhost:5174', // bike-app
      `http://localhost:${process.env.PORT ?? 3000}`, // Swagger UI
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port ?? 3000, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalPipes(
    // Note global validation pipe
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

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
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server is running on http://localhost:${port}`);
    console.log(`Swagger API documentation available at http://localhost:${port}/api`);
  });
}
bootstrap();

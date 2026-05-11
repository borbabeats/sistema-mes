import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ==================== CORS CONFIG ====================
  const allowedOrigins = [
    'https://d399mtdh0ga8g7.cloudfront.net',
    'http://d399mtdh0ga8g7.cloudfront.net',
    'http://frontend-mes-195950944161-us-east-1-an.s3-website-us-east-1.amazonaws.com',
    'http://localhost:3000',
    'http://localhost:5173',     // Vite (muito comum)
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Origin bloqueado: ${origin}`);
        callback(null, false); // ou new Error() se quiser bloquear estritamente
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Content-Length', 'X-Request-ID'],
    maxAge: 86400, // Cache do preflight por 24h
  });
  // ====================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
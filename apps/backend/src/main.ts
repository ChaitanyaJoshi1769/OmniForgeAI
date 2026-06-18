import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from 'pino';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  // Use Pino HTTP middleware
  app.use(pinoHttp({ logger }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.info(`🚀 OmniForge AI Backend is running on http://localhost:${port}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});

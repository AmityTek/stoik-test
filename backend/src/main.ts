import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/config/app-config.service';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      abortOnError: false,
    });

    const config = app.get(AppConfigService);

    app.use(helmet());

    app.use(compression());

    app.enableCors({
      origin: config.isProduction ? config.corsOrigins : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      maxAge: 86400, // 24 hours
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: config.isProduction,
        stopAtFirstError: true,
      }),
    );

    app.enableShutdownHooks();

    await app.listen(config.port, '0.0.0.0');
  } catch (error) {
    logger.error('💥 Failed to start application', error);
    process.exit(1);
  }
}

// Handle unhandled promises and exceptions
process.on('unhandledRejection', (reason) => {
  const logger = new Logger('UnhandledRejection');
  logger.error('Unhandled Promise Rejection:', reason);
  // Don't exit process in production to avoid downtime
});

process.on('uncaughtException', (error) => {
  const logger = new Logger('UncaughtException');
  logger.error('Uncaught Exception:', error);
  process.exit(1); // Exit on uncaught exceptions
});

void bootstrap();

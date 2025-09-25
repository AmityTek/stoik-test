import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: AppConfigService) {
    super({
      log: configService.isDevelopment
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: configService.databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.gracefulShutdown();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Application shutdown signal received: ${signal}`);
    await this.gracefulShutdown();
  }

  private async gracefulShutdown() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed gracefully');
    } catch (error) {
      this.logger.error('Error during database disconnection', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}

@Injectable()
export class DatabaseHealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1 as health_check`;
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error:
          error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }
}

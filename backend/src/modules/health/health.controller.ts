import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from '../database/database-health.service';
import { AppConfigService } from '../config/app-config.service';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  database: {
    status: 'healthy' | 'unhealthy';
    latency?: number;
    error?: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

@Controller()
export class HealthController {
  constructor(
    private readonly databaseHealth: DatabaseHealthService,
    private readonly config: AppConfigService,
  ) {}

  @Get('health')
  async getHealth(): Promise<HealthResponse> {
    const dbHealth = await this.databaseHealth.checkHealth();
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal + memUsage.external;
    const usedMemory = memUsage.heapUsed;

    return {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: this.config.nodeEnv,
      version: process.env['npm_package_version'] || '1.0.0',
      uptime: Math.floor(process.uptime()),
      database: dbHealth,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round((usedMemory / totalMemory) * 100),
      },
    };
  }
}

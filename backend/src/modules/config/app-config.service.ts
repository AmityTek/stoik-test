import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get baseUrl(): string {
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (baseUrl) {
      return baseUrl;
    }
    return `http://localhost:${this.port}`;
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL')!;
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Rate limiting
  get throttleTtl(): number {
    return this.configService.get<number>('THROTTLE_TTL', 60000);
  }

  get throttleLimit(): number {
    return this.configService.get<number>('THROTTLE_LIMIT', 100);
  }

  get createUrlLimit(): number {
    return this.configService.get<number>('CREATE_URL_LIMIT', 50);
  }

  get redirectLimit(): number {
    return this.configService.get<number>('REDIRECT_LIMIT', 200);
  }

  get statsLimit(): number {
    return this.configService.get<number>('STATS_LIMIT', 100);
  }

  get slugLength(): number {
    return this.configService.get<number>('SLUG_LENGTH', 6);
  }

  get maxSlugLength(): number {
    return this.configService.get<number>('MAX_SLUG_LENGTH', 20);
  }

  get minSlugLength(): number {
    return this.configService.get<number>('MIN_SLUG_LENGTH', 4);
  }

  // Security
  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS', '*');
    return origins === '*' ? ['*'] : origins.split(',').map((o) => o.trim());
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  // Logging
  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL', 'info');
  }
}

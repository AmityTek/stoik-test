import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UrlModule } from './modules/url/url.module';
import { HealthModule } from './modules/health/health.module';
import { AppConfigService } from './modules/config/app-config.service';

@Module({
  imports: [
    ConfigModule,

    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        {
          name: 'default',
          ttl: config.throttleTtl,
          limit: config.throttleLimit,
        },
        {
          name: 'strict',
          ttl: 60000, // 1 minute
          limit: 10, // 10 requests for sensitive endpoints
        },
      ],
    }),

    DatabaseModule,

    UrlModule,
    HealthModule,
  ],
})
export class AppModule {}

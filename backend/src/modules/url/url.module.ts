import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { CreateShortUrlUseCase } from './application/use-cases/create-short-url.use-case';
import { RedirectUrlUseCase } from './application/use-cases/redirect-url.use-case';
import { GetUrlStatsUseCase } from './application/use-cases/get-url-stats.use-case';
import { UrlRepositoryImpl } from './infrastructure/database/url.repository.impl';
import { NanoidSlugService } from './infrastructure/services/nanoid-slug.service';
import { UrlRepository } from './domain/repositories/url.repository.abstract';
import { SlugService } from './domain/services/slug.service.abstract';

@Module({
  controllers: [UrlController],
  providers: [
    CreateShortUrlUseCase,
    RedirectUrlUseCase,
    GetUrlStatsUseCase,
    {
      provide: UrlRepository,
      useClass: UrlRepositoryImpl,
    },
    {
      provide: SlugService,
      useClass: NanoidSlugService,
    },
  ],
  exports: [CreateShortUrlUseCase, RedirectUrlUseCase, GetUrlStatsUseCase],
})
export class UrlModule {}

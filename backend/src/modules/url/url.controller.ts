import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { CreateShortUrlUseCase } from './application/use-cases/create-short-url.use-case';
import { RedirectUrlUseCase } from './application/use-cases/redirect-url.use-case';
import { GetUrlStatsUseCase } from './application/use-cases/get-url-stats.use-case';
import { CreateUrlDto } from './application/dtos/create-url.dto';
import { AppConfigService } from '../config/app-config.service';

@Controller()
export class UrlController {
  constructor(
    private readonly createShortUrl: CreateShortUrlUseCase,
    private readonly redirectUrl: RedirectUrlUseCase,
    private readonly getUrlStats: GetUrlStatsUseCase,
    private readonly config: AppConfigService,
  ) {}

  @Post('api/urls')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  async createUrl(@Body() dto: CreateUrlDto) {
    const result = await this.createShortUrl.execute(dto, this.config.baseUrl);
    return {
      success: true,
      data: result,
    };
  }

  @Get('api/urls/:slug/stats')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async getStats(@Param('slug') slug: string) {
    const stats = await this.getUrlStats.execute(slug);
    return {
      success: true,
      data: stats,
    };
  }

  @Get('r/:slug')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const originalUrl = await this.redirectUrl.execute(slug);
    res.redirect(HttpStatus.MOVED_PERMANENTLY, originalUrl);
  }
}

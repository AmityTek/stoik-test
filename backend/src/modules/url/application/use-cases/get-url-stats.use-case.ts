import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { UrlRepository } from '../../domain/repositories/url.repository.interface';
import { UrlStatsDto } from '../dtos/url-response.dto';
import { Url } from '../../domain/entities/url.entity';

@Injectable()
export class GetUrlStatsUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(slug: string): Promise<UrlStatsDto> {
    const url = await this.urlRepository.findBySlug(slug);

    if (!url) {
      throw new NotFoundException('URL non trouvée');
    }

    return this.toDto(url);
  }

  private toDto(url: Url): UrlStatsDto {
    return {
      id: url.id,
      slug: url.slug,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository.abstract';
import { UrlStatsDto } from '../dtos/url-response.dto';
import { Url } from '../../domain/entities/url.entity';

@Injectable()
export class GetUrlStatsUseCase {
  constructor(private readonly urlRepository: UrlRepository) {}

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

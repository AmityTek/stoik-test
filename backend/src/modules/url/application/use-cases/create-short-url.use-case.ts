import { Injectable, BadRequestException } from '@nestjs/common';
import { Url } from '../../domain/entities/url.entity';
import { UrlRepository } from '../../domain/repositories/url.repository.abstract';
import { SlugService } from '../../domain/services/slug.service.abstract';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { UrlResponseDto } from '../dtos/url-response.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly slugService: SlugService,
  ) {}

  async execute(dto: CreateUrlDto, baseUrl: string): Promise<UrlResponseDto> {
    // Vérifier si l'URL existe déjà et est encore active
    const existingUrl = await this.urlRepository.findByOriginalUrl(
      dto.originalUrl,
    );
    if (existingUrl && existingUrl.isActive()) {
      return this.toDto(existingUrl, baseUrl);
    }

    // Valider la date d'expiration
    if (dto.expiresAt && dto.expiresAt <= new Date()) {
      throw new BadRequestException(
        "La date d'expiration doit être dans le futur",
      );
    }

    // Créer une nouvelle URL
    const slug = this.slugService.generate();
    const url = new Url(
      nanoid(), // ID unique
      slug,
      dto.originalUrl,
      new Date(),
      dto.expiresAt || null,
      0,
    );

    const savedUrl = await this.urlRepository.save(url);
    return this.toDto(savedUrl, baseUrl);
  }

  private toDto(url: Url, baseUrl: string): UrlResponseDto {
    return {
      id: url.id,
      slug: url.slug,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.slug}`,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    };
  }
}

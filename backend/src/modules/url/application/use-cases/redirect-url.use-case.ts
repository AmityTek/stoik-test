import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository.abstract';

@Injectable()
export class RedirectUrlUseCase {
  constructor(private readonly urlRepository: UrlRepository) {}

  async execute(slug: string): Promise<string> {
    const url = await this.urlRepository.findBySlug(slug);

    if (!url || !url.isActive()) {
      throw new NotFoundException('URL non trouvée ou expirée');
    }

    this.urlRepository.incrementClicks(slug).catch(console.error);

    return url.originalUrl;
  }
}

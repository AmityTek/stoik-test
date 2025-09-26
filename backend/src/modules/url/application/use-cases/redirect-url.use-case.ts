import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { UrlRepository } from '../../domain/repositories/url.repository.interface';

@Injectable()
export class RedirectUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(slug: string): Promise<string> {
    const url = await this.urlRepository.findBySlug(slug);

    if (!url || !url.isActive()) {
      throw new NotFoundException('URL non trouvée ou expirée');
    }

    this.urlRepository.incrementClicks(slug).catch(console.error);

    return url.originalUrl;
  }
}

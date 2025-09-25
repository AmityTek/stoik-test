import { Url } from '../entities/url.entity';

export abstract class UrlRepository {
  abstract save(url: Url): Promise<Url>;
  abstract findBySlug(slug: string): Promise<Url | null>;
  abstract findByOriginalUrl(originalUrl: string): Promise<Url | null>;
  abstract incrementClicks(slug: string): Promise<void>;
}

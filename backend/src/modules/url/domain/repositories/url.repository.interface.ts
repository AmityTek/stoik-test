import { Url } from '../entities/url.entity';

export interface UrlRepository {
  save(url: Url): Promise<Url>;
  findBySlug(slug: string): Promise<Url | null>;
  findByOriginalUrl(originalUrl: string): Promise<Url | null>;
  incrementClicks(slug: string): Promise<void>;
}

export class UrlResponseDto {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt?: Date | null;
}

export class UrlStatsDto {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date | null;
}

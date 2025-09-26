import { Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository.interface';
import { Url } from '../../domain/entities/url.entity';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class UrlRepositoryImpl implements UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(url: Url): Promise<Url> {
    const saved = await this.prisma.url.create({
      data: {
        id: url.id,
        slug: url.slug,
        originalUrl: url.originalUrl,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        clicks: url.clicks,
      },
    });

    return new Url(
      saved.id,
      saved.slug,
      saved.originalUrl,
      saved.createdAt,
      saved.expiresAt,
      saved.clicks,
    );
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const found = await this.prisma.url.findUnique({ where: { slug } });

    if (!found) return null;

    return new Url(
      found.id,
      found.slug,
      found.originalUrl,
      found.createdAt,
      found.expiresAt,
      found.clicks,
    );
  }

  async findByOriginalUrl(originalUrl: string): Promise<Url | null> {
    const found = await this.prisma.url.findFirst({
      where: { originalUrl },
      orderBy: { createdAt: 'desc' },
    });

    if (!found) return null;

    return new Url(
      found.id,
      found.slug,
      found.originalUrl,
      found.createdAt,
      found.expiresAt,
      found.clicks,
    );
  }

  async incrementClicks(slug: string): Promise<void> {
    await this.prisma.url.update({
      where: { slug },
      data: { clicks: { increment: 1 } },
    });
  }
}

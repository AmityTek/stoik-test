import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUrlStatsUseCase } from '../get-url-stats.use-case';
import { UrlRepository } from '../../../domain/repositories/url.repository.abstract';
import { Url } from '../../../domain/entities/url.entity';

describe('GetUrlStatsUseCase', () => {
  let useCase: GetUrlStatsUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(async () => {
    const mockUrlRepository = {
      save: jest.fn(),
      findBySlug: jest.fn(),
      findByOriginalUrl: jest.fn(),
      incrementClicks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlStatsUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
      ],
    }).compile();

    useCase = module.get<GetUrlStatsUseCase>(GetUrlStatsUseCase);
    urlRepository = module.get(UrlRepository);
  });

  it('should return URL stats for valid slug', async () => {
    const slug = 'abc123';
    const originalUrl = 'https://example.com';
    const createdAt = new Date('2024-01-01');
    const clicks = 42;

    const url = new Url('id-123', slug, originalUrl, createdAt, null, clicks);
    urlRepository.findBySlug.mockResolvedValue(url);

    const result = await useCase.execute(slug);

    expect(result).toEqual({
      id: 'id-123',
      slug,
      originalUrl,
      clicks,
      createdAt,
      expiresAt: null,
    });
  });

  it('should return stats for URL with expiration date', async () => {
    const slug = 'expiring';
    const originalUrl = 'https://example.com';
    const createdAt = new Date('2024-01-01');
    const expiresAt = new Date('2024-12-31');
    const clicks = 10;

    const url = new Url(
      'id-456',
      slug,
      originalUrl,
      createdAt,
      expiresAt,
      clicks,
    );
    urlRepository.findBySlug.mockResolvedValue(url);

    const result = await useCase.execute(slug);

    expect(result).toEqual({
      id: 'id-456',
      slug,
      originalUrl,
      clicks,
      createdAt,
      expiresAt,
    });
  });

  it('should throw NotFoundException for non-existent slug', async () => {
    const slug = 'nonexistent';

    urlRepository.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(slug)).rejects.toThrow(NotFoundException);
  });

  it('should return stats even for expired URL', async () => {
    const slug = 'expired';
    const expiredDate = new Date(Date.now() - 1000);
    const createdAt = new Date('2024-01-01');

    const expiredUrl = new Url(
      'id-expired',
      slug,
      'https://example.com',
      createdAt,
      expiredDate,
      5,
    );

    urlRepository.findBySlug.mockResolvedValue(expiredUrl);

    const result = await useCase.execute(slug);

    expect(result).toEqual({
      id: 'id-expired',
      slug,
      originalUrl: 'https://example.com',
      clicks: 5,
      createdAt,
      expiresAt: expiredDate,
    });
  });
});

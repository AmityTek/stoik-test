import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateShortUrlUseCase } from '../create-short-url.use-case';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
import { SlugService } from '../../../domain/services/slug.service.interface';
import { Url } from '../../../domain/entities/url.entity';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let slugService: jest.Mocked<SlugService>;

  beforeEach(async () => {
    const mockUrlRepository = {
      save: jest.fn(),
      findBySlug: jest.fn(),
      findByOriginalUrl: jest.fn(),
      incrementClicks: jest.fn(),
    };

    const mockSlugService = {
      generate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortUrlUseCase,
        { provide: 'UrlRepository', useValue: mockUrlRepository },
        { provide: 'SlugService', useValue: mockSlugService },
      ],
    }).compile();

    useCase = module.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
    urlRepository = module.get('UrlRepository');
    slugService = module.get('SlugService');
  });

  it('should create a new short URL', async () => {
    const dto = { originalUrl: 'https://example.com' };
    const slug = 'abc123';
    const baseUrl = 'http://localhost:3001';

    slugService.generate.mockReturnValue(slug);
    urlRepository.findByOriginalUrl.mockResolvedValue(null);

    const savedUrl = new Url(
      'id-123',
      slug,
      dto.originalUrl,
      new Date(),
      null,
      0,
    );
    urlRepository.save.mockResolvedValue(savedUrl);

    const result = await useCase.execute(dto, baseUrl);

    expect(result.shortUrl).toBe(`${baseUrl}/r/${slug}`);
    expect(result.originalUrl).toBe(dto.originalUrl);
    expect(urlRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should return existing URL if still active', async () => {
    const dto = { originalUrl: 'https://example.com' };
    const baseUrl = 'http://localhost:3001';

    const existingUrl = new Url(
      'id-456',
      'existing',
      dto.originalUrl,
      new Date(),
      null,
      5,
    );

    urlRepository.findByOriginalUrl.mockResolvedValue(existingUrl);

    const result = await useCase.execute(dto, baseUrl);

    expect(result.slug).toBe('existing');
    expect(result.originalUrl).toBe(dto.originalUrl);
    expect(urlRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should throw error for past expiration date', async () => {
    const dto = {
      originalUrl: 'https://example.com',
      expiresAt: new Date(Date.now() - 1000), // Date dans le passé
    };
    const baseUrl = 'http://localhost:3001';

    await expect(useCase.execute(dto, baseUrl)).rejects.toThrow(
      BadRequestException,
    );
  });
});

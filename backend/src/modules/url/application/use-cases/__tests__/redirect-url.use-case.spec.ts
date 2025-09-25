import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RedirectUrlUseCase } from '../redirect-url.use-case';
import { UrlRepository } from '../../../domain/repositories/url.repository.abstract';
import { Url } from '../../../domain/entities/url.entity';

describe('RedirectUrlUseCase', () => {
  let useCase: RedirectUrlUseCase;
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
        RedirectUrlUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
      ],
    }).compile();

    useCase = module.get<RedirectUrlUseCase>(RedirectUrlUseCase);
    urlRepository = module.get(UrlRepository);
  });

  it('should return original URL for valid slug', async () => {
    const slug = 'abc123';
    const originalUrl = 'https://example.com';

    const url = new Url('id-123', slug, originalUrl, new Date(), null, 0);
    urlRepository.findBySlug.mockResolvedValue(url);
    urlRepository.incrementClicks.mockResolvedValue();

    const result = await useCase.execute(slug);

    expect(result).toBe(originalUrl);
    expect(urlRepository.incrementClicks).toHaveBeenCalledTimes(1);
    expect(urlRepository.incrementClicks).toHaveBeenCalledWith(slug);
  });

  it('should throw NotFoundException for non-existent slug', async () => {
    const slug = 'nonexistent';

    urlRepository.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(slug)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException for expired URL', async () => {
    const slug = 'expired';
    const expiredDate = new Date(Date.now() - 1000);

    const expiredUrl = new Url(
      'id-expired',
      slug,
      'https://example.com',
      new Date(),
      expiredDate,
      0,
    );

    urlRepository.findBySlug.mockResolvedValue(expiredUrl);

    await expect(useCase.execute(slug)).rejects.toThrow(NotFoundException);
  });
});

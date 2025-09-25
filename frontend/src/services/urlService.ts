import { CreateUrlRequest, CreateUrlResponse, UrlStats, ApiResponse } from '../types';

const API_BASE_URL = '/api';

class UrlService {
  async createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    const response = await fetch(`${API_BASE_URL}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'URL courte');
    }

    const result: ApiResponse<CreateUrlResponse> = await response.json();
    return result.data;
  }

  async getUrlStats(slug: string): Promise<UrlStats> {
    const response = await fetch(`${API_BASE_URL}/urls/${slug}/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des statistiques');
    }

    const result: ApiResponse<UrlStats> = await response.json();
    return result.data;
  }

  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error: unknown) {
      return false;
    }
  }
}

export const urlService = new UrlService();

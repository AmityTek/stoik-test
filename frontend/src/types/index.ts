export interface CreateUrlRequest {
  originalUrl: string;
  expiresAt?: string;
}

export interface CreateUrlResponse {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
}

export interface UrlStats {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  details?: unknown;
}

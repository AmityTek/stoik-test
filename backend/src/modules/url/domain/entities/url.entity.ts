export class Url {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly originalUrl: string,
    public readonly createdAt: Date,
    public readonly expiresAt: Date | null = null,
    public readonly clicks: number = 0,
  ) {}

  isExpired(): boolean {
    return this.expiresAt !== null && this.expiresAt < new Date();
  }

  isActive(): boolean {
    return !this.isExpired();
  }
}

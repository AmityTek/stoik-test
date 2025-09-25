import { IsUrl, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL invalide' })
  originalUrl: string;

  @IsOptional()
  @IsDateString({}, { message: "Date d'expiration invalide" })
  @Transform(({ value }) => (value ? new Date(value as string) : null))
  expiresAt?: Date | null;
}

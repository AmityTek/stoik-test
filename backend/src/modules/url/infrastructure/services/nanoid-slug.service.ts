import { Injectable } from '@nestjs/common';
import { SlugService } from '../../domain/services/slug.service.interface';
import { AppConfigService } from '../../../config/app-config.service';
import { nanoid } from 'nanoid';

@Injectable()
export class NanoidSlugService implements SlugService {
  constructor(private readonly config: AppConfigService) {}

  generate(): string {
    return nanoid(this.config.slugLength);
  }
}

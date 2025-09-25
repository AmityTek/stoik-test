import { Injectable } from '@nestjs/common';
import { SlugService } from '../../domain/services/slug.service.abstract';
import { AppConfigService } from '../../../config/app-config.service';
import { nanoid } from 'nanoid';

@Injectable()
export class NanoidSlugService extends SlugService {
  constructor(private readonly config: AppConfigService) {
    super();
  }

  generate(): string {
    return nanoid(this.config.slugLength);
  }
}

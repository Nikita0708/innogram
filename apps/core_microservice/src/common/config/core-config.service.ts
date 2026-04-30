import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@innogram/shared';

@Injectable()
export class CoreConfigService extends AppConfigService {
  get port(): number { return parseInt(this.get('PORT', '3001')); }
  get authServiceUrl(): string { return this.get('AUTH_SERVICE_URL', 'http://localhost:3002'); }

  get cloudinaryCloudName(): string { return this.get('CLOUDINARY_CLOUD_NAME'); }
  get cloudinaryApiKey(): string { return this.get('CLOUDINARY_API_KEY'); }
  get cloudinaryApiSecret(): string { return this.get('CLOUDINARY_API_SECRET'); }
}

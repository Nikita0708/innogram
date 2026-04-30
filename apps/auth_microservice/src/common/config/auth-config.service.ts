import { AppConfigService } from '@innogram/shared';

class AuthConfigService extends AppConfigService {
  get port(): number { return parseInt(this.get('PORT', '3002')); }

  get jwtSecret(): string { return this.get('JWT_SECRET'); }
  get jwtExpiresIn(): string { return this.get('JWT_EXPIRES_IN', '15m'); }
  get jwtRefreshExpiresIn(): string { return this.get('JWT_REFRESH_EXPIRES_IN', '7d'); }

  get redisHost(): string { return this.get('REDIS_HOST', 'localhost'); }
  get redisPort(): number { return parseInt(this.get('REDIS_PORT', '6379')); }

  get googleClientId(): string { return this.get('GOOGLE_CLIENT_ID'); }
  get googleClientSecret(): string { return this.get('GOOGLE_CLIENT_SECRET'); }
  get googleCallbackUrl(): string { return this.get('GOOGLE_CALLBACK_URL'); }
}

export const config = new AuthConfigService();

export class AppConfigService {
  protected get<T = string>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value as unknown as T;
  }

  get nodeEnv(): string { return this.get('NODE_ENV', 'development'); }
  get isProduction(): boolean { return this.nodeEnv === 'production'; }
  get isDevelopment(): boolean { return this.nodeEnv === 'development'; }
  get clientUrl(): string { return this.get('CLIENT_URL', 'http://localhost:3000'); }

  get postgresHost(): string { return this.get('POSTGRES_HOST', 'localhost'); }
  get postgresPort(): number { return parseInt(this.get('POSTGRES_PORT', '5432')); }
  get postgresUser(): string { return this.get('POSTGRES_USER', 'innogram_user'); }
  get postgresPassword(): string { return this.get('POSTGRES_PASSWORD', 'innogram_password'); }
  get postgresDb(): string { return this.get('POSTGRES_DB', 'innogram'); }
}

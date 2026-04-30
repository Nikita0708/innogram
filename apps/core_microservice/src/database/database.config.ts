import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreConfigService } from '../common/config/core-config.service';
import { ALL_ENTITIES } from '@innogram/database';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: CoreConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.postgresHost,
      port: this.config.postgresPort,
      username: this.config.postgresUser,
      password: this.config.postgresPassword,
      database: this.config.postgresDb,
      entities: ALL_ENTITIES,
      synchronize: false,
      logging: this.config.isDevelopment,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: false,
    };
  }
}

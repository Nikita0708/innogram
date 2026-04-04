import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Modules
// ... will be added in the next PRs

// Database configuration
import { DatabaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // Feature modules
    // ... will be added in the next PRs
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

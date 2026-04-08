import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'innogram_user',
  password: process.env.POSTGRES_PASSWORD || 'innogram_password',
  database: process.env.POSTGRES_DB || 'innogram',
  schema: 'public',
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
});
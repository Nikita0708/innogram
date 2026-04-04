import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'innogram_user',
    password: process.env.POSTGRES_PASSWORD || 'innogram_password',
    database: process.env.POSTGRES_DB || 'innogram',
    entities: [join(process.cwd(), 'src/database/entities/**/*.entity{.ts,.js}')],
    migrations: [join(process.cwd(), 'src/database/migrations/*{.ts,.js}')],
    synchronize: false,
});
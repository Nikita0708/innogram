import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'innogram_user',
  password: process.env.POSTGRES_PASSWORD || 'innogram_password',
  database: process.env.POSTGRES_DB || 'innogram',
});

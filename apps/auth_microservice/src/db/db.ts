import { Pool } from 'pg';
import { config } from '../common/config/auth-config.service';

export const pool = new Pool({
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDb,
});

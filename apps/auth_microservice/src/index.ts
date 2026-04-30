import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import 'reflect-metadata';
import { AppDataSource } from './db/data-source';

dotenv.config({ path: '../../.env' });
dotenv.config();

import { config } from './common/config/auth-config.service';
import authRoutes from './controllers/auth.controller';
import { ERROR_MESSAGES, HTTP_STATUS, createLogger } from '@innogram/shared';

const logger = createLogger('auth-microservice');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(morgan('combined'));

app.use('/internal/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'OK',
    service: 'Authentication Microservice',
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.message, { stack: err.stack });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: config.isDevelopment ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
});

app.use('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
});

AppDataSource.initialize()
  .then(() => {
    logger.info('Database connected');
    app.listen(config.port, () => {
      logger.info(`Auth Microservice running on port ${config.port}`);
      logger.info(`Health check available at http://localhost:${config.port}/health`);
    });
  })
  .catch((error) => {
    logger.error('Database connection failed', { error });
    process.exit(1);
  });

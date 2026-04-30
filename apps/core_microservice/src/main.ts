import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CoreConfigService } from './common/config/core-config.service';
import { createLogger } from '@innogram/shared';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

const logger = createLogger('core-microservice');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  const config = app.get(CoreConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: config.clientUrl,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Innogram Core API')
    .setDescription('Core Microservice API for Innogram Social Media Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port);

  logger.info(`Core Microservice running on port ${config.port}`);
  logger.info(`API Documentation available at http://localhost:${config.port}/api/docs`);
}

bootstrap();

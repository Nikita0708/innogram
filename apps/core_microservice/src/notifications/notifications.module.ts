import { NotificationRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationRepository, useFactory: (ds: DataSource) => new NotificationRepository(ds), inject: [DataSource] },
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule { }

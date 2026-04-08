import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERROR_MESSAGES } from '../constants/error-messages';
import { Notification } from '@/database/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  async sendNotification(userId: string) {
    try {
      // TODO: Implement sendNotification
      throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
    } catch (error) {
      throw error;
    }
  }
}

import { NotificationRepository } from '@innogram/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async sendNotification(
    recipientProfileId: string,
    type: string,
    title: string,
    message: string,
    data?: object,
  ) {
    const notification = this.notificationRepository.create({
      id: uuidv4(),
      recipient_profile_id: recipientProfileId,
      type,
      title,
      message,
      data: data ?? {},
      is_read: false,
      created_by: recipientProfileId,
    });
    return this.notificationRepository.save(notification);
  }

  async getMyNotifications(profileId: string) {
    return this.notificationRepository.findByRecipient(profileId);
  }

  async markAsRead(profileId: string, notificationId: string) {
    const notification = await this.notificationRepository.findByIdAndRecipient(notificationId, profileId);
    if (!notification) throw new NotFoundException('Notification not found');
    await this.notificationRepository.markAsRead(notificationId, profileId);
    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(profileId: string) {
    await this.notificationRepository.markAllAsRead(profileId);
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(profileId: string, notificationId: string) {
    const notification = await this.notificationRepository.findByIdAndRecipient(notificationId, profileId);
    if (!notification) throw new NotFoundException('Notification not found');
    await this.notificationRepository.delete(notificationId);
    return { message: 'Notification deleted' };
  }
}

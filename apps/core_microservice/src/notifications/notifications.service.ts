import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/database/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

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
    return this.notificationRepository.find({
      where: { recipient_profile_id: profileId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(profileId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient_profile_id: profileId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    await this.notificationRepository.update(notificationId, {
      is_read: true,
      read_at: new Date(),
      updated_by: profileId,
    });

    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(profileId: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ is_read: true, read_at: new Date(), updated_by: profileId })
      .where('recipient_profile_id = :profileId AND is_read = false', { profileId })
      .execute();

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(profileId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient_profile_id: profileId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    await this.notificationRepository.delete(notificationId);
    return { message: 'Notification deleted' };
  }
}

import { DataSource, Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

export class NotificationRepository {
  private readonly repo: Repository<Notification>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Notification);
  }

  create(data: Partial<Notification>): Notification {
    return this.repo.create(data);
  }

  save(notification: Notification): Promise<Notification> {
    return this.repo.save(notification);
  }

  findByRecipient(profileId: string): Promise<Notification[]> {
    return this.repo.find({
      where: { recipient_profile_id: profileId },
      order: { created_at: 'DESC' },
    });
  }

  findByIdAndRecipient(id: string, profileId: string): Promise<Notification | null> {
    return this.repo.findOne({ where: { id, recipient_profile_id: profileId } });
  }

  markAsRead(id: string, profileId: string): Promise<void> {
    return this.repo
      .update(id, { is_read: true, read_at: new Date(), updated_by: profileId })
      .then(() => undefined);
  }

  markAllAsRead(profileId: string): Promise<void> {
    return this.repo
      .createQueryBuilder()
      .update(Notification)
      .set({ is_read: true, read_at: new Date(), updated_by: profileId })
      .where('recipient_profile_id = :profileId AND is_read = false', { profileId })
      .execute()
      .then(() => undefined);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

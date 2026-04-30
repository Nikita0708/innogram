import { DataSource, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

export class ProfileRepository {
  private readonly repo: Repository<Profile>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Profile);
  }

  findById(id: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(userId: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { user_id: userId } });
  }

  findActiveByUserId(userId: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { user_id: userId, deleted: false } });
  }

  findByUsername(username: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { username } });
  }

  findByUsernames(usernames: string[]): Promise<Profile[]> {
    return this.repo
      .createQueryBuilder('profile')
      .where('profile.username IN (:...usernames)', { usernames })
      .andWhere('profile.deleted = false')
      .getMany();
  }

  update(id: string, data: Partial<Profile>): Promise<void> {
    return this.repo.update(id, data).then(() => undefined);
  }

  softDelete(id: string, userId: string): Promise<void> {
    return this.repo
      .update(id, { deleted: true, deleted_at: new Date(), updated_by: userId })
      .then(() => undefined);
  }
}

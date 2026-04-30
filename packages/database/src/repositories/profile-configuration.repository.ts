import { DataSource, Repository } from 'typeorm';
import { ProfileConfiguration } from '../entities/profile-configuration.entity';

export class ProfileConfigurationRepository {
  private readonly repo: Repository<ProfileConfiguration>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProfileConfiguration);
  }

  findById(id: string): Promise<ProfileConfiguration | null> {
    return this.repo.findOne({ where: { id } });
  }
}

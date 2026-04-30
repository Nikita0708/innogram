import { DataSource, Repository } from 'typeorm';
import { ProfileToProfileConfiguration } from '../entities/profile-to-profile-configuration.entity';

export class ProfileToProfileConfigurationRepository {
  private readonly repo: Repository<ProfileToProfileConfiguration>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProfileToProfileConfiguration);
  }

  save(data: Partial<ProfileToProfileConfiguration>): Promise<ProfileToProfileConfiguration> {
    return this.repo.save(data as ProfileToProfileConfiguration);
  }
}

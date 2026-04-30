import { DataSource, Repository } from 'typeorm';
import { MessageAsset } from '../entities/message-asset.entity';

export class MessageAssetRepository {
  private readonly repo: Repository<MessageAsset>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(MessageAsset);
  }

  save(data: Partial<MessageAsset>): Promise<MessageAsset> {
    return this.repo.save(data as MessageAsset);
  }
}

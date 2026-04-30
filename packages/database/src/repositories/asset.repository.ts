import { DataSource, Repository } from 'typeorm';
import { Asset } from '../entities/asset.entity';

export class AssetRepository {
  private readonly repo: Repository<Asset>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Asset);
  }

  create(data: Partial<Asset>): Asset {
    return this.repo.create(data);
  }

  save(asset: Asset): Promise<Asset> {
    return this.repo.save(asset);
  }
}

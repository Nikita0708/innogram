import { DataSource, Repository } from 'typeorm';
import { PostAsset } from '../entities/post-asset.entity';

export class PostAssetRepository {
  private readonly repo: Repository<PostAsset>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(PostAsset);
  }

  create(data: Partial<PostAsset>): PostAsset {
    return this.repo.create(data);
  }

  saveMany(postAssets: PostAsset[]): Promise<PostAsset[]> {
    return this.repo.save(postAssets);
  }

  deleteByPostId(postId: string): Promise<void> {
    return this.repo.delete({ post_id: postId }).then(() => undefined);
  }
}

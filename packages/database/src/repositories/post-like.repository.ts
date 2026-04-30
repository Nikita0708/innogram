import { DataSource, Repository } from 'typeorm';
import { PostLike } from '../entities/post-like.entity';

export class PostLikeRepository {
  private readonly repo: Repository<PostLike>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(PostLike);
  }

  findByPostAndProfile(postId: string, profileId: string): Promise<PostLike | null> {
    return this.repo.findOne({ where: { post_id: postId, profile_id: profileId } });
  }

  create(data: Partial<PostLike>): PostLike {
    return this.repo.create(data);
  }

  save(like: PostLike): Promise<PostLike> {
    return this.repo.save(like);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

import { DataSource, Repository } from 'typeorm';
import { CommentLike } from '../entities/comment-like.entity';

export class CommentLikeRepository {
  private readonly repo: Repository<CommentLike>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(CommentLike);
  }

  findByCommentAndProfile(commentId: string, profileId: string): Promise<CommentLike | null> {
    return this.repo.findOne({ where: { comment_id: commentId, profile_id: profileId } });
  }

  create(data: Partial<CommentLike>): CommentLike {
    return this.repo.create(data);
  }

  save(like: CommentLike): Promise<CommentLike> {
    return this.repo.save(like);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

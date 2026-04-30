import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

export class CommentRepository {
  private readonly repo: Repository<Comment>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Comment);
  }

  findById(id: string): Promise<Comment | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByIdWithProfile(id: string): Promise<Comment | null> {
    return this.repo.findOne({ where: { id }, relations: ['profile'] });
  }

  findByPost(postId: string): Promise<Comment[]> {
    return this.repo.find({
      where: { post_id: postId, parent_comment_id: null },
      order: { created_at: 'DESC' },
      relations: ['profile'],
    });
  }

  findReplies(commentId: string): Promise<Comment[]> {
    return this.repo.find({
      where: { parent_comment_id: commentId },
      order: { created_at: 'ASC' },
      relations: ['profile'],
    });
  }

  create(data: Partial<Comment>): Comment {
    return this.repo.create(data);
  }

  save(comment: Comment): Promise<Comment> {
    return this.repo.save(comment);
  }

  update(id: string, content: string, updatedBy: string): Promise<void> {
    return this.repo.update(id, { content, updated_by: updatedBy }).then(() => undefined);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

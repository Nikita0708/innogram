import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

export class PostRepository {
  private readonly repo: Repository<Post>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Post);
  }

  findById(id: string): Promise<Post | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['post_assets', 'post_assets.asset'],
    });
  }

  findByIdSimple(id: string): Promise<Post | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByProfileId(profileId: string): Promise<Post[]> {
    return this.repo.find({
      where: { profile_id: profileId, is_archived: false },
      relations: ['post_assets', 'post_assets.asset'],
    });
  }

  create(data: Partial<Post>): Post {
    return this.repo.create(data);
  }

  save(post: Post): Promise<Post> {
    return this.repo.save(post);
  }

  update(id: string, data: Partial<Post>): Promise<void> {
    return this.repo.update(id, data).then(() => undefined);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  async search(query: string, page: number, limit: number): Promise<{ data: Post[]; total: number }> {
    const [data, total] = await this.repo
      .createQueryBuilder('post')
      .where('post.content ILIKE :query', { query: `%${query}%` })
      .andWhere('post.is_archived = false')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total };
  }
}

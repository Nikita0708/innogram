import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

export class RefreshTokenRepository {
  private readonly repo: Repository<RefreshToken>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(RefreshToken);
  }

  findById(id: string): Promise<RefreshToken | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(data: Partial<RefreshToken>): Promise<RefreshToken> {
    return this.repo.save(data as RefreshToken);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

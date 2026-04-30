import { DataSource, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

export class AccountRepository {
  private readonly repo: Repository<Account>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Account);
  }

  findByEmail(email: string): Promise<Account | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByLocalEmail(email: string): Promise<Account | null> {
    return this.repo.findOne({ where: { email, provider: 'local' } });
  }

  findByProvider(provider: string, providerId: string): Promise<Account | null> {
    return this.repo.findOne({ where: { provider, provider_id: providerId } });
  }

  save(data: Partial<Account>): Promise<Account> {
    return this.repo.save(data as Account);
  }

  updateLastLogin(id: string): Promise<void> {
    return this.repo.update(id, { last_login_at: new Date() }).then(() => undefined);
  }
}

import { DataSource, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

export class ChatRepository {
  private readonly repo: Repository<Chat>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Chat);
  }

  findById(id: string): Promise<Chat | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(data: Partial<Chat>): Promise<Chat> {
    return this.repo.save(data as Chat);
  }
}

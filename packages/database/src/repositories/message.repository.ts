import { DataSource, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

export class MessageRepository {
  private readonly repo: Repository<Message>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Message);
  }

  findById(id: string): Promise<Message | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(data: Partial<Message>): Promise<Message> {
    return this.repo.save(data as Message);
  }
}

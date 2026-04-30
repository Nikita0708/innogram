import { DataSource, Repository } from 'typeorm';
import { ChatParticipant } from '../entities/chat-participant.entity';

export class ChatParticipantRepository {
  private readonly repo: Repository<ChatParticipant>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ChatParticipant);
  }

  findById(id: string): Promise<ChatParticipant | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(data: Partial<ChatParticipant>): Promise<ChatParticipant> {
    return this.repo.save(data as ChatParticipant);
  }
}

import { ChatRepository } from '@innogram/database';
import { Injectable } from '@nestjs/common';

import { ERROR_MESSAGES } from '@innogram/shared';

@Injectable()
export class ChatsService {
  constructor(private readonly chatRepository: ChatRepository) { }

  async createChat(userId: string) {
    try {
      // TODO: Implement create chat
      throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
    } catch (error) {
      throw error;
    }
  }
}

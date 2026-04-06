import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERROR_MESSAGES } from '../constants/error-messages';
import { Chat } from '@/database/entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) { }

  async createChat(userId: string) {
    try {
      // TODO: Implement create chat
      throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
    } catch (error) {
      throw error;
    }
  }
}

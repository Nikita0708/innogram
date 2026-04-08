import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERROR_MESSAGES } from '../constants/error-messages';
import { Comment } from '@/database/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  async createComment(userId: string) {
    try {
      // TODO: Implement create comment
      throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
    } catch (error) {
      throw error;
    }
  }
}

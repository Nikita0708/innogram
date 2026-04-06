import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERROR_MESSAGES } from '../constants/error-messages';
import { Post } from '@/database/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) { }

  async createPost(userId: string) {
    try {
      // TODO: Implement create post
      throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
    } catch (error) {
      throw error;
    }
  }
}

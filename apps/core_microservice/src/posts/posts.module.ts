import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '@/database/entities/post.entity';
import { PostAsset } from '@/database/entities/post-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostAsset]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule { }

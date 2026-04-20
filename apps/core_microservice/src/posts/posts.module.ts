import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '@/database/entities/post.entity';
import { PostAsset } from '@/database/entities/post-asset.entity';
import { PostLike } from '@/database/entities/post-like.entity';
import { Profile } from '@/database/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostAsset, PostLike, Profile]), AuthModule, NotificationsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule { }

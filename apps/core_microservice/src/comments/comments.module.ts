import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfilesModule } from '../profiles/profile.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '@/database/entities/comment.entity';
import { CommentLike } from '@/database/entities/comment-like.entity';
import { Post } from '@/database/entities/post.entity';
import { Profile } from '@/database/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike, Post, Profile]),
    AuthModule,
    NotificationsModule,
    ProfilesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

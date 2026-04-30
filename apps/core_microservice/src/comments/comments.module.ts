import { CommentRepository, CommentLikeRepository, PostRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfilesModule } from '../profiles/profile.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [AuthModule, NotificationsModule, ProfilesModule],
  controllers: [CommentsController],
  providers: [
    { provide: CommentRepository, useFactory: (ds: DataSource) => new CommentRepository(ds), inject: [DataSource] },
    { provide: CommentLikeRepository, useFactory: (ds: DataSource) => new CommentLikeRepository(ds), inject: [DataSource] },
    { provide: PostRepository, useFactory: (ds: DataSource) => new PostRepository(ds), inject: [DataSource] },
    CommentsService,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}

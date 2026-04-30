import { PostRepository, PostAssetRepository, PostLikeRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [PostsController],
  providers: [
    { provide: PostRepository, useFactory: (ds: DataSource) => new PostRepository(ds), inject: [DataSource] },
    { provide: PostAssetRepository, useFactory: (ds: DataSource) => new PostAssetRepository(ds), inject: [DataSource] },
    { provide: PostLikeRepository, useFactory: (ds: DataSource) => new PostLikeRepository(ds), inject: [DataSource] },
    PostsService,
  ],
  exports: [PostsService],
})
export class PostsModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfilesModule } from './profiles/profile.module';

// Database configuration
import { DatabaseConfig } from './database/database.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // Feature modules
    CloudinaryModule,
    AssetsModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ChatsModule,
    NotificationsModule,
    ProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

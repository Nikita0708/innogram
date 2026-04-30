import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { AppConfigService } from '@innogram/shared';

// Needed for `typeorm migration:run -d src/data-source.ts` CLI usage
dotenv.config({ path: '../../.env' });
dotenv.config();

import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { Asset } from './entities/asset.entity';
import { Post } from './entities/post.entity';
import { PostAsset } from './entities/post-asset.entity';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { Message } from './entities/message.entity';
import { MessageAsset } from './entities/message-asset.entity';
import { Notification } from './entities/notification.entity';
import { ProfileFollow } from './entities/profile-follow.entity';
import { ProfileConfiguration } from './entities/profile-configuration.entity';
import { ProfileToProfileConfiguration } from './entities/profile-to-profile-configuration.entity';

export const ALL_ENTITIES = [
  User, Account, Profile, RefreshToken,
  Asset,
  Post, PostAsset, PostLike,
  Comment, CommentLike,
  Chat, ChatParticipant, Message, MessageAsset,
  Notification,
  ProfileFollow, ProfileConfiguration, ProfileToProfileConfiguration,
];

const config = new AppConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgresHost,
  port: config.postgresPort,
  username: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDb,
  schema: 'public',
  entities: ALL_ENTITIES,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

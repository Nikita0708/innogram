import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from '@/database/entities/chat.entity';
import { Profile } from '@/database/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Profile]), AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule { }

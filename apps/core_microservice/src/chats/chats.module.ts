import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from '@/database/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule { }

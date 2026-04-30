import { ChatRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatsController],
  providers: [
    { provide: ChatRepository, useFactory: (ds: DataSource) => new ChatRepository(ds), inject: [DataSource] },
    ChatsService,
  ],
  exports: [ChatsService],
})
export class ChatsModule { }

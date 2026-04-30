import { UserRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    { provide: UserRepository, useFactory: (ds: DataSource) => new UserRepository(ds), inject: [DataSource] },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule { }

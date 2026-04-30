import { ProfileRepository, ProfileFollowRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [ProfilesController],
  providers: [
    { provide: ProfileRepository, useFactory: (ds: DataSource) => new ProfileRepository(ds), inject: [DataSource] },
    { provide: ProfileFollowRepository, useFactory: (ds: DataSource) => new ProfileFollowRepository(ds), inject: [DataSource] },
    ProfilesService,
  ],
  exports: [ProfilesService, ProfileRepository],
})
export class ProfilesModule {}

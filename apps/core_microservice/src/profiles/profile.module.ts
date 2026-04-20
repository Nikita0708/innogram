import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { Profile } from '@/database/entities/profile.entity';
import { ProfileFollow } from '@/database/entities/profile-follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, ProfileFollow]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}

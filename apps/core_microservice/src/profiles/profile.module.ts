import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { Profile } from '@/database/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), AuthModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule { }

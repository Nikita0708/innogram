import { ProfileRepository } from '@innogram/database';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DataSource } from 'typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    { provide: ProfileRepository, useFactory: (ds: DataSource) => new ProfileRepository(ds), inject: [DataSource] },
    AuthService,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard, ProfileRepository],
})
export class AuthModule {}

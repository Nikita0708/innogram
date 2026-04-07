import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Profile } from '@/database/entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async getCurrentProfile(userId: string) {
    this.logger.log('getting current profile')
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId, deleted: false },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found')
    }
    return profile
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getCurrentProfile(userId);

    await this.profileRepository.update(profile.id, {
      ...dto,
      updated_by: userId,
    });

    return this.profileRepository.findOne({ where: { id: profile.id } });
  }

  async deleteProfile(userId: string) {
    const profile = await this.getCurrentProfile(userId);

    await this.profileRepository.update(profile.id, {
      deleted: true,
      deleted_at: new Date(),
      updated_by: userId,
    })
  }


}

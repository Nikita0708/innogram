import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Profile } from '@/database/entities/profile.entity';
import { ProfileFollow } from '@/database/entities/profile-follow.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(ProfileFollow)
    private readonly followRepository: Repository<ProfileFollow>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async getCurrentProfile(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId, deleted: false },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getCurrentProfile(userId);

    await this.profileRepository.update(profile.id, { ...dto, updated_by: userId });

    return this.profileRepository.findOne({ where: { id: profile.id } });
  }

  async deleteProfile(userId: string) {
    const profile = await this.getCurrentProfile(userId);

    await this.profileRepository.update(profile.id, {
      deleted: true,
      deleted_at: new Date(),
      updated_by: userId,
    });
  }

  async followProfile(followerProfileId: string, followedProfileId: string) {
    if (followerProfileId === followedProfileId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existing = await this.followRepository.findOne({
      where: { follower_profile_id: followerProfileId, followed_profile_id: followedProfileId },
    });

    if (existing) throw new ConflictException('Already following');

    const targetProfile = await this.profileRepository.findOne({
      where: { id: followedProfileId },
    });

    if (!targetProfile) throw new NotFoundException('Profile not found');

    const follow = this.followRepository.create({
      id: uuidv4(),
      follower_profile_id: followerProfileId,
      followed_profile_id: followedProfileId,
      accepted: targetProfile.is_public,
      created_by: followerProfileId,
    });

    await this.followRepository.save(follow);

    await this.notificationsService.sendNotification(
      followedProfileId,
      'new_follower',
      'New follower',
      targetProfile.is_public ? 'Someone started following you' : 'Someone sent you a follow request',
      { follower_profile_id: followerProfileId },
    );

    return follow;
  }

  async unfollowProfile(followerProfileId: string, followedProfileId: string) {
    const follow = await this.followRepository.findOne({
      where: { followed_profile_id: followedProfileId, follower_profile_id: followerProfileId },
    });

    if (!follow) throw new NotFoundException('Follow not found');

    await this.followRepository.delete(follow.id);

    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(profileId: string) {
    return this.followRepository.find({
      where: { followed_profile_id: profileId, accepted: true },
      relations: ['followerProfile'],
    });
  }

  async getFollowing(profileId: string) {
    return this.followRepository.find({
      where: { follower_profile_id: profileId, accepted: true },
      relations: ['followedProfile'],
    });
  }

  async acceptFollowRequest(profileId: string, followerProfileId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower_profile_id: followerProfileId,
        followed_profile_id: profileId,
        accepted: false,
      },
    });

    if (!follow) throw new NotFoundException('Follow request not found');

    await this.followRepository.update(follow.id, { accepted: true });

    await this.notificationsService.sendNotification(
      followerProfileId,
      'follow_accepted',
      'Follow request accepted',
      'Your follow request was accepted',
      { profile_id: profileId },
    );

    return { message: 'Follow request was accepted' };
  }

  async rejectFollowRequest(profileId: string, followerProfileId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower_profile_id: followerProfileId,
        followed_profile_id: profileId,
        accepted: false,
      },
    });

    if (!follow) throw new NotFoundException('Follow request not found');

    await this.followRepository.delete(follow.id);

    return { message: 'Follow request was rejected' };
  }

  async getPendingRequests(profileId: string) {
    return this.followRepository.find({
      where: { followed_profile_id: profileId, accepted: false },
      relations: ['followerProfile'],
    });
  }
}

import { ProfileRepository, ProfileFollowRepository } from '@innogram/database';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { NotificationsService } from '../notifications/notifications.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly followRepository: ProfileFollowRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getCurrentProfile(userId: string) {
    const profile = await this.profileRepository.findActiveByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getCurrentProfile(userId);
    const { birthday, ...rest } = dto;
    await this.profileRepository.update(profile.id, {
      ...rest,
      ...(birthday ? { birthday: new Date(birthday) } : {}),
      updated_by: userId,
    });
    return this.profileRepository.findById(profile.id);
  }

  async deleteProfile(userId: string) {
    const profile = await this.getCurrentProfile(userId);
    await this.profileRepository.softDelete(profile.id, userId);
  }

  async followProfile(followerProfileId: string, followedProfileId: string) {
    if (followerProfileId === followedProfileId) throw new BadRequestException('You cannot follow yourself');

    const existing = await this.followRepository.findFollow(followerProfileId, followedProfileId);
    if (existing) throw new ConflictException('Already following');

    const targetProfile = await this.profileRepository.findById(followedProfileId);
    if (!targetProfile) throw new NotFoundException('Profile not found');

    const follow = await this.followRepository.save({
      id: uuidv4(),
      follower_profile_id: followerProfileId,
      followed_profile_id: followedProfileId,
      accepted: targetProfile.is_public,
      created_by: followerProfileId,
    });

    await this.notificationsService.sendNotification(
      followedProfileId, 'new_follower', 'New follower',
      targetProfile.is_public ? 'Someone started following you' : 'Someone sent you a follow request',
      { follower_profile_id: followerProfileId },
    );

    return follow;
  }

  async unfollowProfile(followerProfileId: string, followedProfileId: string) {
    const follow = await this.followRepository.findFollow(followerProfileId, followedProfileId);
    if (!follow) throw new NotFoundException('Follow not found');
    await this.followRepository.delete(follow.id);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(profileId: string) {
    return this.followRepository.findFollowers(profileId);
  }

  async getFollowing(profileId: string) {
    return this.followRepository.findFollowing(profileId);
  }

  async acceptFollowRequest(profileId: string, followerProfileId: string) {
    const follow = await this.followRepository.findPendingFollow(followerProfileId, profileId);
    if (!follow) throw new NotFoundException('Follow request not found');
    await this.followRepository.accept(follow.id);
    await this.notificationsService.sendNotification(followerProfileId, 'follow_accepted', 'Follow request accepted', 'Your follow request was accepted', { profile_id: profileId });
    return { message: 'Follow request was accepted' };
  }

  async rejectFollowRequest(profileId: string, followerProfileId: string) {
    const follow = await this.followRepository.findPendingFollow(followerProfileId, profileId);
    if (!follow) throw new NotFoundException('Follow request not found');
    await this.followRepository.delete(follow.id);
    return { message: 'Follow request was rejected' };
  }

  async getPendingRequests(profileId: string) {
    return this.followRepository.findPendingRequests(profileId);
  }
}

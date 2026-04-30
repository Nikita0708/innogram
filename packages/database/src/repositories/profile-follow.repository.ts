import { DataSource, Repository } from 'typeorm';
import { ProfileFollow } from '../entities/profile-follow.entity';

export class ProfileFollowRepository {
  private readonly repo: Repository<ProfileFollow>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProfileFollow);
  }

  findFollow(followerProfileId: string, followedProfileId: string): Promise<ProfileFollow | null> {
    return this.repo.findOne({
      where: { follower_profile_id: followerProfileId, followed_profile_id: followedProfileId },
    });
  }

  findPendingFollow(followerProfileId: string, followedProfileId: string): Promise<ProfileFollow | null> {
    return this.repo.findOne({
      where: { follower_profile_id: followerProfileId, followed_profile_id: followedProfileId, accepted: false },
    });
  }

  findFollowers(profileId: string): Promise<ProfileFollow[]> {
    return this.repo.find({
      where: { followed_profile_id: profileId, accepted: true },
      relations: ['followerProfile'],
    });
  }

  findFollowing(profileId: string): Promise<ProfileFollow[]> {
    return this.repo.find({
      where: { follower_profile_id: profileId, accepted: true },
      relations: ['followedProfile'],
    });
  }

  findPendingRequests(profileId: string): Promise<ProfileFollow[]> {
    return this.repo.find({
      where: { followed_profile_id: profileId, accepted: false },
      relations: ['followerProfile'],
    });
  }

  save(data: Partial<ProfileFollow>): Promise<ProfileFollow> {
    return this.repo.save(data as ProfileFollow);
  }

  accept(id: string): Promise<void> {
    return this.repo.update(id, { accepted: true }).then(() => undefined);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}

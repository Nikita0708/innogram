import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, Check, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'profiles_follows', schema: 'main' })
@Unique(['follower_profile_id', 'followed_profile_id'])
@Check(`"follower_profile_id" != "followed_profile_id"`)
export class ProfileFollow {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  follower_profile_id: string;

  @Column({ type: 'varchar', length: 36 })
  followed_profile_id: string;

  @Column({ type: 'boolean', nullable: true })
  accepted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  @ManyToOne(() => Profile, profile => profile.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_profile_id' })
  followerProfile: Profile;

  @ManyToOne(() => Profile, profile => profile.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followed_profile_id' })
  followedProfile: Profile;
}

import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { ProfileConfiguration } from './profile-configuration.entity';

@Entity({ name: 'profiles_to_profiles_configurations', schema: 'main' })
@Unique(['profile_id', 'profile_configuration_id'])
export class ProfileToProfileConfiguration {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  profile_id: string;

  @Column({ type: 'varchar', length: 36 })
  profile_configuration_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => ProfileConfiguration, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_configuration_id' })
  profileConfiguration: ProfileConfiguration;
}

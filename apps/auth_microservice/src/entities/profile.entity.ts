import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'profiles', schema: 'main' })
export class Profile {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  user_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  display_name: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.profiles)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from './post.entity';

@Entity({ name: 'comments', schema: 'main' })
export class Comment {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  post_id: string;

  @Column({ type: 'varchar', length: 36 })
  profile_id: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  parent_comment_id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  // Relations
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comment;
}

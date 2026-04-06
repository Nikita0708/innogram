import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Asset } from './asset.entity';

@Entity({ name: 'posts_assets', schema: 'main' })
@Unique(['post_id', 'asset_id'])
export class PostAsset {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  post_id: string;

  @Column({ type: 'varchar', length: 36 })
  asset_id: string;

  @Column({ type: 'integer', default: 0 })
  order_index: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;
}

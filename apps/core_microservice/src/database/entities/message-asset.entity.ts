import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { Asset } from './asset.entity';

@Entity({ name: 'messages_assets', schema: 'main' })
@Unique(['message_id', 'asset_id'])
export class MessageAsset {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  message_id: string;

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

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;
}

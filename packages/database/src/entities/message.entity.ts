import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Chat } from './chat.entity';

@Entity({ name: 'messages', schema: 'main' })
export class Message {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  chat_id: string;

  @Column({ type: 'varchar', length: 36 })
  profile_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  reply_to_message_id: string;

  @Column({ type: 'boolean', default: false })
  is_edited: boolean;

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

  // Relations
  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Message, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reply_to_message_id' })
  replyToMessage: Message;
}

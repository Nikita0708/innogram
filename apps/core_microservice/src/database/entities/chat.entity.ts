import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'chats', schema: 'main' })
export class Chat {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'private' })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;
}

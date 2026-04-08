import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'assets', schema: 'main' })
export class Asset {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 500 })
  file_path: string;

  @Column({ type: 'varchar', length: 100 })
  file_type: string;

  @Column({ type: 'integer' })
  file_size: number;

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
}

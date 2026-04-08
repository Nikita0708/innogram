import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'profile_configurations', schema: 'main' })
export class ProfileConfiguration {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  config_key: string;

  @Column({ type: 'boolean', default: false })
  is_admin_accessible_only: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36 })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;
}

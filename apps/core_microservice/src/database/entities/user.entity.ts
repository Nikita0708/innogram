import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'users', schema: 'auth' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 20, default: 'User' })
  role: string;

  @Column({ type: 'boolean', default: false })
  disabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  updated_by: string;

  // Relations
  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @OneToMany(() => Profile, profile => profile.user)
  profiles: Profile[];
}

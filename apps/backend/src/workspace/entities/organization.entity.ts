import {
  Entity,
  Column,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Workspace } from './workspace.entity';
import { OrganizationMember } from './organization-member.entity';

@Entity('organizations')
@Index(['slug'])
@Unique(['slug'])
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ default: 'free' })
  plan: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @OneToMany(
    () => Workspace,
    (workspace) => workspace.organization,
    { cascade: true, eager: false },
  )
  workspaces: Workspace[];

  @OneToMany(
    () => OrganizationMember,
    (member) => member.organization,
    { cascade: true, eager: false },
  )
  members: OrganizationMember[];
}

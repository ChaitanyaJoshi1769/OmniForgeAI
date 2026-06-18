import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Organization } from './organization.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { Asset } from '../../asset/entities/asset.entity';

@Entity('workspaces')
@Index(['organizationId'])
@Index(['slug'])
@Unique(['organizationId', 'slug'])
export class Workspace extends BaseEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @ManyToOne(
    () => Organization,
    (org) => org.workspaces,
    { onDelete: 'CASCADE' },
  )
  organization: Organization;

  @Column()
  organizationId: string;

  @OneToMany(
    () => WorkspaceMember,
    (member) => member.workspace,
    { cascade: true, eager: false },
  )
  members: WorkspaceMember[];

  @OneToMany(
    () => Asset,
    (asset) => asset.workspace,
    { cascade: true, eager: false },
  )
  assets: Asset[];
}

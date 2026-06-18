import {
  Entity,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Organization } from './organization.entity';
import { Workspace } from './workspace.entity';
import { OrganizationRole } from '../../common/enums/organization-role.enum';
import { WorkspaceRole } from '../../common/enums/workspace-role.enum';

@Entity('invitations')
@Index(['email'])
@Index(['token'])
@Index(['organizationId'])
@Index(['workspaceId'])
@Index(['expiresAt'])
export class Invitation extends BaseEntity {
  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ nullable: true })
  organizationRole?: OrganizationRole;

  @Column({ nullable: true })
  workspaceRole?: WorkspaceRole;

  @Column({ nullable: true })
  message?: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ nullable: true })
  acceptedAt?: Date;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  invitedByUserId?: string;

  @ManyToOne(
    () => Organization,
    { onDelete: 'CASCADE', nullable: true },
  )
  organization: Organization;

  @Column({ nullable: true })
  organizationId?: string;

  @ManyToOne(
    () => Workspace,
    { onDelete: 'CASCADE', nullable: true },
  )
  workspace: Workspace;

  @Column({ nullable: true })
  workspaceId?: string;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}

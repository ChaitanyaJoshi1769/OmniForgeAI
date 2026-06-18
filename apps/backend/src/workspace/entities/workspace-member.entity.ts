import {
  Entity,
  Column,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Workspace } from './workspace.entity';
import { WorkspaceRole } from '../../common/enums/workspace-role.enum';

@Entity('workspace_members')
@Index(['workspaceId', 'userId'])
@Unique(['workspaceId', 'userId'])
export class WorkspaceMember extends BaseEntity {
  @Column({ type: 'enum', enum: WorkspaceRole, default: WorkspaceRole.MEMBER })
  role: WorkspaceRole;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  joinedAt?: Date;

  @ManyToOne(() => User, (user) => user.workspaceMemberships, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(
    () => Workspace,
    (workspace) => workspace.members,
    { onDelete: 'CASCADE' },
  )
  workspace: Workspace;

  @Column()
  workspaceId: string;
}

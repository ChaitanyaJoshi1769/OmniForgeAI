import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('code_repositories')
@Index(['workspaceId'])
export class CodeRepository extends BaseEntity {
  @Column() name: string;
  @Column() language: string;
  @Column({ type: 'text' }) content: string;
  @Column() gitUrl?: string;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}

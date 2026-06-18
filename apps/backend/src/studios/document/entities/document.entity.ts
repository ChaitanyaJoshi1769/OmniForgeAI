import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('documents')
@Index(['workspaceId'])
export class Document extends BaseEntity {
  @Column() title: string;
  @Column({ nullable: true }) description?: string;
  @Column() s3Key: string;
  @Column() fileSize: number;
  @Column() fileType: string; // pdf, docx, xlsx, etc.
  @Column({ nullable: true }) prompt?: string;
  @Column({ nullable: true }) aiModel?: string;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}

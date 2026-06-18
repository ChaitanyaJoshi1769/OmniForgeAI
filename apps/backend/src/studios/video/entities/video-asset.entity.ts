import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('video_assets')
export class VideoAsset extends BaseEntity {
  @Column() name: string;
  @Column({ nullable: true }) description?: string;
  @Column() s3Key: string;
  @Column() duration: number;
  @Column() width: number;
  @Column() height: number;
  @Column({ nullable: true }) fps?: number;
  @Column({ nullable: true }) prompt?: string;
  @Column({ nullable: true }) aiModel?: string;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}

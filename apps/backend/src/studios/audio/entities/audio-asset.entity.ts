import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('audio_assets')
export class AudioAsset extends BaseEntity {
  @Column() name: string;
  @Column() s3Key: string;
  @Column() duration: number;
  @Column({ default: 44100 }) sampleRate: number;
  @Column({ nullable: true }) prompt?: string;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}

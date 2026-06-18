import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('audio_assets')
@Index(['workspaceId'])
export class AudioAsset extends BaseEntity {
  @Column() name: string;
  @Column({ nullable: true }) description?: string;
  @Column() s3Key: string;
  @Column() duration: number;
  @Column({ default: 44100 }) sampleRate: number;
  @Column({ default: 2 }) channels: number;
  @Column({ nullable: true }) bitrate?: number;
  @Column({ default: 'mp3' }) format: string;
  @Column({ nullable: true }) prompt?: string;
  @Column({ nullable: true }) aiModel?: string;
  @Column({ nullable: true }) voice?: string;
  @Column({ nullable: true }) language?: string;
  @Column({ default: false }) isMusic: boolean;
  @Column({ type: 'jsonb', nullable: true }) metadata?: Record<string, any>;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}

import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';
import { ImageVersion } from './image-version.entity';

@Entity('image_assets')
@Index(['workspaceId'])
export class ImageAsset extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'image' })
  type: string; // image, illustration, photograph, etc.

  @Column()
  s3Key: string;

  @Column({ nullable: true })
  s3Url?: string;

  @Column({ nullable: true })
  thumbnailS3Key?: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  fileSize: number;

  @Column({ default: 'JPEG' })
  format: string;

  @Column({ nullable: true })
  prompt?: string;

  @Column({ nullable: true })
  aiModel?: string;

  @Column({ nullable: true })
  aiGeneratedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  embedding?: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @OneToMany(() => ImageVersion, (version) => version.asset, { cascade: true })
  versions: ImageVersion[];
}

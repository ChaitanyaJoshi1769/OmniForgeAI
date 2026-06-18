import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { AssetVersion } from './asset-version.entity';
import { AssetModality } from '../../common/enums/asset-modality.enum';

@Entity('assets')
@Index(['workspaceId'])
@Index(['workspaceId', 'name'])
@Index(['workspaceId', 'modality'])
@Index(['createdAt'])
export class Asset extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: AssetModality })
  modality: AssetModality;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column()
  s3Key: string;

  @Column({ nullable: true })
  s3Url?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'uuid', array: true, nullable: true })
  collectionIds?: string[];

  @Column({ nullable: true })
  thumbnailS3Key?: string;

  @Column({ nullable: true })
  embedding?: string; // Vector embedding for semantic search

  @Column({ nullable: true })
  duration?: number; // For audio/video assets

  @Column({ nullable: true })
  width?: number; // For image assets

  @Column({ nullable: true })
  height?: number; // For image assets

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  archivedAt?: Date;

  @ManyToOne(
    () => Workspace,
    (workspace) => workspace.assets,
    { onDelete: 'CASCADE' },
  )
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @OneToMany(
    () => AssetVersion,
    (version) => version.asset,
    { cascade: true, eager: false },
  )
  versions: AssetVersion[];
}

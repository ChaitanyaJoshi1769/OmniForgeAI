import {
  Entity,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Asset } from './asset.entity';

@Entity('asset_versions')
@Index(['assetId'])
@Index(['assetId', 'createdAt'])
export class AssetVersion extends BaseEntity {
  @Column()
  versionNumber: number;

  @Column()
  s3Key: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  checksum?: string; // SHA-256 for integrity verification

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  createdByUserId?: string;

  @Column({ default: false })
  isCurrent: boolean;

  @ManyToOne(
    () => Asset,
    (asset) => asset.versions,
    { onDelete: 'CASCADE' },
  )
  asset: Asset;

  @Column()
  assetId: string;
}

import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ImageAsset } from './image-asset.entity';

@Entity('image_versions')
@Index(['assetId'])
export class ImageVersion extends BaseEntity {
  @Column()
  versionNumber: number;

  @Column()
  s3Key: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  fileSize: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isCurrent: boolean;

  @ManyToOne(() => ImageAsset, (asset) => asset.versions, { onDelete: 'CASCADE' })
  asset: ImageAsset;

  @Column()
  assetId: string;
}

import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VideoAsset } from './video-asset.entity';

@Entity('video_segments')
@Index(['videoId'])
export class VideoSegment extends BaseEntity {
  @Column()
  videoId: string;

  @Column()
  startTime: number;

  @Column()
  endTime: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  sceneType?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => VideoAsset, (video) => video.segments, { onDelete: 'CASCADE' })
  video: VideoAsset;
}

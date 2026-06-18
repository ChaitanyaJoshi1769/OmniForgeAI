import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoSegment } from './entities/video-segment.entity';
import { VideoAssetRepository } from './repositories/video-asset.repository';
import { VideoGenerationService } from './services/video-generation.service';
import { AIModule } from '../../ai/ai.module';
import { WorkspaceModule } from '../../workspace/workspace.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAsset, VideoSegment]),
    AIModule,
    WorkspaceModule,
    CommonModule,
  ],
  providers: [VideoAssetRepository, VideoGenerationService],
  exports: [VideoAssetRepository, VideoGenerationService],
})
export class VideoModule {}

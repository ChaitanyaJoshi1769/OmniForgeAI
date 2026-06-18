import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoSegment } from './entities/video-segment.entity';
import { VideoGenerationService } from './services/video-generation.service';
import { AIModule } from '../../ai/ai.module';
import { WorkspaceModule } from '../../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAsset, VideoSegment]),
    AIModule,
    WorkspaceModule,
  ],
  providers: [VideoGenerationService],
  exports: [VideoGenerationService],
})
export class VideoModule {}

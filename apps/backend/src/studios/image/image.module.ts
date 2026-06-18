import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageAsset } from './entities/image-asset.entity';
import { ImageVersion } from './entities/image-version.entity';
import { ImageGenerationService } from './services/image-generation.service';
import { AIModule } from '../../ai/ai.module';
import { WorkspaceModule } from '../../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageAsset, ImageVersion]),
    AIModule,
    WorkspaceModule,
  ],
  providers: [ImageGenerationService],
  exports: [ImageGenerationService],
})
export class ImageModule {}

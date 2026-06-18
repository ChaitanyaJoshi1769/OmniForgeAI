import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioAsset } from './entities/audio-asset.entity';
import { AudioGenerationService } from './services/audio-generation.service';
import { AIModule } from '../../ai/ai.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AudioAsset]),
    AIModule,
    CommonModule,
  ],
  providers: [AudioGenerationService],
  exports: [AudioGenerationService],
})
export class AudioModule {}

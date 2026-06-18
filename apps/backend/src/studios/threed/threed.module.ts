import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model3D } from './entities/model-3d.entity';
import { Model3DGenerationService } from './services/model-3d-generation.service';
import { AIModule } from '../../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model3D]), AIModule],
  providers: [Model3DGenerationService],
  exports: [Model3DGenerationService],
})
export class ThreeDModule {}

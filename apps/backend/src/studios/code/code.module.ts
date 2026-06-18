import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRepository } from './entities/code-repository.entity';
import { CodeGenerationService } from './services/code-generation.service';
import { AIModule } from '../../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([CodeRepository]), AIModule],
  providers: [CodeGenerationService],
  exports: [CodeGenerationService],
})
export class CodeModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentGenerationService } from './services/document-generation.service';
import { AIModule } from '../../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), AIModule],
  providers: [DocumentGenerationService],
  exports: [DocumentGenerationService],
})
export class DocumentModule {}

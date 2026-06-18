import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextDocument } from './entities/text-document.entity';
import { TextVersion } from './entities/text-version.entity';
import { TextDocumentRepository } from './repositories/text-document.repository';
import { TextGenerationService } from './services/text-generation.service';
import { TextEditingService } from './services/text-editing.service';
import { TextResolver } from './resolvers/text.resolver';
import { AIModule } from '../../ai/ai.module';
import { WorkspaceModule } from '../../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextDocument, TextVersion]),
    AIModule,
    WorkspaceModule,
  ],
  providers: [
    TextDocumentRepository,
    TextGenerationService,
    TextEditingService,
    TextResolver,
  ],
  exports: [
    TextDocumentRepository,
    TextGenerationService,
    TextEditingService,
  ],
})
export class TextModule {}

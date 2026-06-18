import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditService } from './services/audit.service';
import { EmailService } from './services/email.service';
import { StorageService } from './services/storage.service';
import { VectorSearchService } from './services/vector-search.service';
import { SearchService } from './services/search.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
  ],
  providers: [
    AuditLogRepository,
    AuditService,
    EmailService,
    StorageService,
    VectorSearchService,
    SearchService,
  ],
  exports: [
    AuditLogRepository,
    AuditService,
    EmailService,
    StorageService,
    VectorSearchService,
    SearchService,
  ],
})
export class CommonModule {}

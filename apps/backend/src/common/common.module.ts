import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditService } from './services/audit.service';
import { EmailService } from './services/email.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
  ],
  providers: [
    AuditLogRepository,
    AuditService,
    EmailService,
  ],
  exports: [
    AuditLogRepository,
    AuditService,
    EmailService,
  ],
})
export class CommonModule {}

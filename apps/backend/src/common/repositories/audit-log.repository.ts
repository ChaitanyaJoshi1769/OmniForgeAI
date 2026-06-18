import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    repository: Repository<AuditLog>,
  ) {
    super(repository);
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: { userId } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByOrganization(organizationId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: { organizationId } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByWorkspace(workspaceId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: { workspaceId } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: { action } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
    });
  }

  async findByResource(resource: string, resourceId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: { resource, resourceId } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
    });
  }

  async findFailures(): Promise<AuditLog[]> {
    return this.repository.find({
      where: { status: 'failure' } as FindOptionsWhere<AuditLog>,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}

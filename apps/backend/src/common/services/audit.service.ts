import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

export interface AuditAction {
  action: string;
  resource: string;
  resourceId: string;
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  errorMessage?: string;
  durationMs?: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(action: AuditAction): Promise<AuditLog> {
    const audit = this.auditRepository.create({
      action: action.action,
      resource: action.resource,
      resourceId: action.resourceId,
      userId: action.userId,
      organizationId: action.organizationId,
      workspaceId: action.workspaceId,
      changes: action.changes,
      metadata: action.metadata,
      ipAddress: action.ipAddress,
      userAgent: action.userAgent,
      status: action.status,
      errorMessage: action.errorMessage,
      durationMs: action.durationMs || 0,
    });

    return this.auditRepository.save(audit);
  }

  async getUserActions(
    userId: string,
    limit = 100,
    offset = 0,
  ): Promise<[AuditLog[], number]> {
    return this.auditRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async getOrganizationAuditLog(
    organizationId: string,
    limit = 100,
    offset = 0,
  ): Promise<[AuditLog[], number]> {
    return this.auditRepository.findAndCount({
      where: { organizationId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async getWorkspaceAuditLog(
    workspaceId: string,
    limit = 100,
    offset = 0,
  ): Promise<[AuditLog[], number]> {
    return this.auditRepository.findAndCount({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async getActionHistory(
    resource: string,
    resourceId: string,
  ): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { resource, resourceId },
      order: { createdAt: 'DESC' },
    });
  }

  async cleanup(daysOld = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.auditRepository.delete({
      createdAt: { $lt: cutoffDate } as any,
    });

    return result.affected || 0;
  }
}

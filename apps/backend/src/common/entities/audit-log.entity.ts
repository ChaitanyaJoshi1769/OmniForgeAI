import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('audit_logs')
@Index(['userId'])
@Index(['organizationId'])
@Index(['workspaceId'])
@Index(['createdAt'])
@Index(['action'])
export class AuditLog extends BaseEntity {
  @Column()
  action: string;

  @Column()
  resource: string;

  @Column()
  resourceId: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  workspaceId?: string;

  @Column('jsonb', { nullable: true })
  changes?: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column()
  status: string; // success, failure, warning

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: 'bigint', default: 0 })
  durationMs: number;
}

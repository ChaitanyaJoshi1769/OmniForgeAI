import { Entity, Column, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Model } from './model.entity';

@Entity('model_usage')
@Index(['modelId'])
@Index(['organizationId'])
@Index(['workspaceId'])
@Index(['userId'])
@Index(['date'])
export class ModelUsage extends BaseEntity {
  @Column()
  modelId: string;

  @ManyToOne(() => Model, { onDelete: 'CASCADE' })
  model: Model;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  workspaceId?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  requestCount: number;

  @Column({ default: 0 })
  inputTokens: number;

  @Column({ default: 0 })
  outputTokens: number;

  @Column({ type: 'decimal', precision: 12, scale: 6, default: 0 })
  totalCostUSD: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  averageLatencyMs: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  successRate: number; // percentage

  @Column()
  date: Date;

  @Column({ nullable: true })
  metadata?: Record<string, any>;
}

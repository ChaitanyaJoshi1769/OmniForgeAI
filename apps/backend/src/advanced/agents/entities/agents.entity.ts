import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('agentss')
export class Agents extends BaseEntity {
  @Column() name: string;
  @Column({ nullable: true }) description?: string;
  @Column({ type: 'jsonb', nullable: true }) config?: Record<string, any>;
}

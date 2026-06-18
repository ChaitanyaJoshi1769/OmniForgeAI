import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('models')
@Index(['provider'])
@Index(['modelId'])
@Index(['modality'])
export class Model extends BaseEntity {
  @Column()
  provider: string; // openai, anthropic, google, stability, elevenlabs, etc.

  @Column()
  modelId: string; // gpt-4, claude-3-opus, gemini-pro, etc.

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  modality: string; // text, image, audio, video, 3d, code, etc.

  @Column({ nullable: true })
  inputModality?: string; // What it accepts

  @Column({ nullable: true })
  outputModality?: string; // What it produces

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  costPer1kInputTokens: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  costPer1kOutputTokens: number;

  @Column({ nullable: true })
  contextWindow?: number;

  @Column({ nullable: true })
  maxOutputTokens?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ type: 'jsonb', nullable: true })
  capabilities?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  parameters?: Record<string, any>;

  @Column({ nullable: true })
  releasedAt?: Date;

  @Column({ nullable: true })
  deprecatedAt?: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: '4.5' })
  averageLatencyMs: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: '99.9' })
  uptime: number; // percentage
}

import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';
import { TextVersion } from './text-version.entity';

@Entity('text_documents')
@Index(['workspaceId'])
@Index(['type'])
export class TextDocument extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'blog' })
  type: string; // blog, article, email, documentation, social, book, etc.

  @Column({ default: 'markdown' })
  format: string; // markdown, html, plain_text, rich_text

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  tone?: string; // professional, casual, creative, technical, etc.

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  readingLevelGrade?: number;

  @Column({ default: 0 })
  wordCount: number;

  @Column({ default: 0 })
  characterCount: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ nullable: true })
  aiGeneratedAt?: Date;

  @Column({ nullable: true })
  aiModel?: string;

  @Column({ nullable: true })
  sourceUrl?: string; // For RAG-sourced content

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @OneToMany(() => TextVersion, (version) => version.document, { cascade: true })
  versions: TextVersion[];
}

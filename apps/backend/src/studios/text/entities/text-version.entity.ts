import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TextDocument } from './text-document.entity';

@Entity('text_versions')
@Index(['documentId'])
export class TextVersion extends BaseEntity {
  @Column()
  versionNumber: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  wordCount: number;

  @Column({ default: 0 })
  characterCount: number;

  @Column({ nullable: true })
  createdByUserId?: string;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => TextDocument, (doc) => doc.versions, { onDelete: 'CASCADE' })
  document: TextDocument;

  @Column()
  documentId: string;
}

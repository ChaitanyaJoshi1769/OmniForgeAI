import { Entity, Column, ManyToOne, ForeignKey, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('api_keys')
@Index(['userId'])
@Index(['hashedKey'])
export class ApiKey extends BaseEntity {
  @Column()
  name: string;

  @Column({ select: false })
  hashedKey: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  scopes?: string[];

  @Column({ type: 'jsonb', nullable: true })
  allowedIps?: string[];

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  lastUsedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.apiKeys, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
}

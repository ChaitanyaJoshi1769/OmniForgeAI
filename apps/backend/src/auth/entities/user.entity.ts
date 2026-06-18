import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrganizationMember } from '../../workspace/entities/organization-member.entity';
import { WorkspaceMember } from '../../workspace/entities/workspace-member.entity';
import { ApiKey } from './api-key.entity';
import { AuthProvider } from '../../common/enums/auth-provider.enum';

@Entity('users')
@Index(['email'])
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  passwordHash?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerifiedAt?: Date;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ type: 'enum', enum: AuthProvider, array: true, default: [] })
  authProviders: AuthProvider[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @OneToMany(
    () => OrganizationMember,
    (member) => member.user,
    { cascade: true, eager: false },
  )
  organizationMemberships: OrganizationMember[];

  @OneToMany(
    () => WorkspaceMember,
    (member) => member.user,
    { cascade: true, eager: false },
  )
  workspaceMemberships: WorkspaceMember[];

  @OneToMany(() => ApiKey, (key) => key.user, { cascade: true, eager: false })
  apiKeys: ApiKey[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

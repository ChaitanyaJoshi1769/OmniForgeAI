import {
  Entity,
  Column,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Organization } from './organization.entity';
import { OrganizationRole } from '../../common/enums/organization-role.enum';

@Entity('organization_members')
@Index(['organizationId', 'userId'])
@Unique(['organizationId', 'userId'])
export class OrganizationMember extends BaseEntity {
  @Column({ type: 'enum', enum: OrganizationRole, default: OrganizationRole.MEMBER })
  role: OrganizationRole;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: string[];

  @Column({ nullable: true })
  inviteEmail?: string;

  @Column({ nullable: true })
  inviteToken?: string;

  @Column({ default: false })
  isInvitationAccepted: boolean;

  @Column({ nullable: true })
  invitationAcceptedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.organizationMemberships, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(
    () => Organization,
    (org) => org.members,
    { onDelete: 'CASCADE' },
  )
  organization: Organization;

  @Column()
  organizationId: string;
}

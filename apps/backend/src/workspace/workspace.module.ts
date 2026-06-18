import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Workspace } from './entities/workspace.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Invitation } from './entities/invitation.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceMemberRepository } from './repositories/workspace-member.repository';
import { InvitationRepository } from './repositories/invitation.repository';
import { WorkspaceService } from './services/workspace.service';
import { InvitationService } from './services/invitation.service';
import { WorkspaceResolver } from './resolvers/workspace.resolver';
import { OrganizationResolver } from './resolvers/organization.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Workspace,
      OrganizationMember,
      WorkspaceMember,
      Invitation,
    ]),
    AuthModule,
  ],
  providers: [
    OrganizationRepository,
    WorkspaceRepository,
    WorkspaceMemberRepository,
    InvitationRepository,
    WorkspaceService,
    InvitationService,
    WorkspaceResolver,
    OrganizationResolver,
  ],
  exports: [
    WorkspaceService,
    InvitationService,
    OrganizationRepository,
    WorkspaceRepository,
    WorkspaceMemberRepository,
    InvitationRepository,
  ],
})
export class WorkspaceModule {}

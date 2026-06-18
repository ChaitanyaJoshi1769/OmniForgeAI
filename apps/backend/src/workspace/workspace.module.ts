import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Workspace } from './entities/workspace.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceMemberRepository } from './repositories/workspace-member.repository';
import { WorkspaceService } from './services/workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Workspace,
      OrganizationMember,
      WorkspaceMember,
    ]),
  ],
  providers: [
    OrganizationRepository,
    WorkspaceRepository,
    WorkspaceMemberRepository,
    WorkspaceService,
  ],
  exports: [
    WorkspaceService,
    OrganizationRepository,
    WorkspaceRepository,
    WorkspaceMemberRepository,
  ],
})
export class WorkspaceModule {}

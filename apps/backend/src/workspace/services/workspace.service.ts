import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from '../dto/workspace.dto';
import { WorkspaceMemberRepository } from '../repositories/workspace-member.repository';
import { WorkspaceRole } from '../../common/enums/workspace-role.enum';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
  ) {}

  async createWorkspace(
    input: CreateWorkspaceInput,
    userId: string,
  ): Promise<Workspace> {
    // Verify organization exists and user has access
    const organization = await this.organizationRepository.findById(
      input.organizationId,
    );
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if slug is already taken
    const existing = await this.workspaceRepository.findBySlug(
      input.organizationId,
      input.slug,
    );
    if (existing) {
      throw new BadRequestException(
        'A workspace with this slug already exists in this organization',
      );
    }

    // Create workspace
    const workspace = await this.workspaceRepository.create({
      name: input.name,
      slug: input.slug,
      description: input.description,
      organizationId: input.organizationId,
    });

    // Add creator as owner
    await this.workspaceMemberRepository.create({
      workspaceId: workspace.id,
      userId,
      role: WorkspaceRole.OWNER,
    });

    return workspace;
  }

  async updateWorkspace(
    id: string,
    input: UpdateWorkspaceInput,
    userId: string,
  ): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check user has access
    await this.verifyWorkspaceAccess(workspace.id, userId, WorkspaceRole.EDITOR);

    return this.workspaceRepository.update(id, {
      name: input.name,
      description: input.description,
      icon: input.icon,
    });
  }

  async getWorkspace(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id, [
      'organization',
    ]);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Verify user has access
    await this.verifyWorkspaceAccess(id, userId);

    return workspace;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const members = await this.workspaceMemberRepository.findByUser(userId);
    const workspaceIds = members.map((m) => m.workspaceId);

    if (workspaceIds.length === 0) {
      return [];
    }

    return this.workspaceRepository.repository.find({
      where: workspaceIds.map((id) => ({ id })),
      relations: ['organization'],
    });
  }

  async verifyWorkspaceAccess(
    workspaceId: string,
    userId: string,
    minimumRole?: WorkspaceRole,
  ): Promise<boolean> {
    const member = await this.workspaceMemberRepository.findByUserAndWorkspace(
      userId,
      workspaceId,
    );

    if (!member || !member.isActive) {
      throw new ForbiddenException(
        'You do not have access to this workspace',
      );
    }

    if (minimumRole && member.role !== minimumRole) {
      // Check role hierarchy
      const roleHierarchy: Record<WorkspaceRole, number> = {
        [WorkspaceRole.OWNER]: 4,
        [WorkspaceRole.EDITOR]: 3,
        [WorkspaceRole.MEMBER]: 2,
        [WorkspaceRole.VIEWER]: 1,
      };

      if (roleHierarchy[member.role] < roleHierarchy[minimumRole]) {
        throw new ForbiddenException(
          'You do not have sufficient permissions for this action',
        );
      }
    }

    return true;
  }

  async deleteWorkspace(id: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Only owners can delete
    await this.verifyWorkspaceAccess(id, userId, WorkspaceRole.OWNER);

    return this.workspaceRepository.delete(id);
  }
}

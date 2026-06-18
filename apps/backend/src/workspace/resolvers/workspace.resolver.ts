import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from '../services/workspace.service';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceDto, CreateWorkspaceInput, UpdateWorkspaceInput, WorkspaceMemberDto } from '../dto/workspace.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';

@Resolver(() => WorkspaceDto)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Query(() => [WorkspaceDto])
  @UseGuards(JwtAuthGuard)
  async myWorkspaces(@CurrentUser() user: User): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspaceService.getUserWorkspaces(user.id);
    return workspaces.map((w) => this.toDto(w));
  }

  @Query(() => WorkspaceDto)
  @UseGuards(JwtAuthGuard)
  async workspace(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceService.getWorkspace(id, user.id);
    return this.toDto(workspace);
  }

  @Mutation(() => WorkspaceDto)
  @UseGuards(JwtAuthGuard)
  async createWorkspace(
    @Args('input') input: CreateWorkspaceInput,
    @CurrentUser() user: User,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceService.createWorkspace(input, user.id);
    return this.toDto(workspace);
  }

  @Mutation(() => WorkspaceDto)
  @UseGuards(JwtAuthGuard)
  async updateWorkspace(
    @Args('id') id: string,
    @Args('input') input: UpdateWorkspaceInput,
    @CurrentUser() user: User,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceService.updateWorkspace(id, input, user.id);
    return this.toDto(workspace);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteWorkspace(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.workspaceService.deleteWorkspace(id, user.id);
  }

  private toDto(workspace: Workspace): WorkspaceDto {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      icon: workspace.icon,
      isActive: workspace.isActive,
      organizationId: workspace.organizationId,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }
}

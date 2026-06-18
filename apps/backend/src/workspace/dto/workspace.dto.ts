import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsSlug } from 'class-validator';
import { WorkspaceRole } from '../../common/enums/workspace-role.enum';

@ObjectType()
export class WorkspaceDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field()
  isActive: boolean;

  @Field()
  organizationId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsSlug()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsString()
  organizationId: string;
}

@InputType()
export class UpdateWorkspaceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;
}

@ObjectType()
export class WorkspaceMemberDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  workspaceId: string;

  @Field()
  role: WorkspaceRole;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  joinedAt?: Date;
}

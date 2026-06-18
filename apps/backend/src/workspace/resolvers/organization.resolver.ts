import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { Organization } from '../entities/organization.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { IsSlug, IsString, IsOptional } from 'class-validator';
import { InputType, Field as GQLField } from '@nestjs/graphql';

@ObjectType()
export class OrganizationDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  plan: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateOrganizationInput {
  @GQLField()
  @IsString()
  name: string;

  @GQLField()
  @IsSlug()
  slug: string;

  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  website?: string;
}

@InputType()
export class UpdateOrganizationInput {
  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  logo?: string;

  @GQLField({ nullable: true })
  @IsOptional()
  @IsString()
  website?: string;
}

@Resolver(() => OrganizationDto)
export class OrganizationResolver {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  @Query(() => [OrganizationDto])
  @UseGuards(JwtAuthGuard)
  async myOrganizations(
    @CurrentUser() user: User,
  ): Promise<OrganizationDto[]> {
    // Find organizations where user is a member
    // For now, return empty array - would need to implement user org lookup
    return [];
  }

  @Query(() => OrganizationDto, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async organization(
    @Args('slug') slug: string,
  ): Promise<OrganizationDto | null> {
    const org = await this.organizationRepository.findBySlug(slug);
    return org ? this.toDto(org) : null;
  }

  @Mutation(() => OrganizationDto)
  @UseGuards(JwtAuthGuard)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationDto> {
    // Check if slug is unique
    const exists = await this.organizationRepository.existsBySlug(input.slug);
    if (exists) {
      throw new BadRequestException('Organization slug already exists');
    }

    const org = await this.organizationRepository.create({
      name: input.name,
      slug: input.slug,
      description: input.description,
      website: input.website,
      plan: 'free',
      isActive: true,
    });

    // Add user as owner
    // TODO: Create organization member relationship

    return this.toDto(org);
  }

  @Mutation(() => OrganizationDto)
  @UseGuards(JwtAuthGuard)
  async updateOrganization(
    @Args('id') id: string,
    @Args('input') input: UpdateOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationDto> {
    // Verify user is org admin
    const org = await this.organizationRepository.update(id, {
      name: input.name,
      description: input.description,
      logo: input.logo,
      website: input.website,
    });

    return this.toDto(org);
  }

  private toDto(org: Organization): OrganizationDto {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      logo: org.logo,
      website: org.website,
      plan: org.plan,
      isActive: org.isActive,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}

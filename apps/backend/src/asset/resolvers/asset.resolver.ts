import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  InputType,
} from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AssetService } from '../services/asset.service';
import { AssetUploadService } from '../services/asset-upload.service';
import { AssetSearchService } from '../services/asset-search.service';
import { AssetDto } from '../dto/asset.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { WorkspaceService } from '../../workspace/services/workspace.service';

@ObjectType()
export class PresignedUrlResponse {
  @Field()
  url: string;

  @Field()
  key: string;
}

@ObjectType()
export class AssetSearchResponse {
  @Field(() => [AssetDto])
  assets: AssetDto[];

  @Field()
  total: number;

  @Field({ nullable: true })
  query?: string;

  @Field()
  searchType: string;
}

@InputType()
export class AssetSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  modality?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  from?: number;

  @Field({ nullable: true })
  @IsOptional()
  size?: number;
}

@Resolver(() => AssetDto)
export class AssetResolver {
  constructor(
    private readonly assetService: AssetService,
    private readonly assetUploadService: AssetUploadService,
    private readonly assetSearchService: AssetSearchService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Query(() => AssetDto)
  @UseGuards(JwtAuthGuard)
  async asset(
    @Args('id') id: string,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<AssetDto> {
    // Verify workspace access
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    const asset = await this.assetService.getAsset(id, workspaceId);
    return this.toDto(asset);
  }

  @Query(() => [AssetDto])
  @UseGuards(JwtAuthGuard)
  async assets(
    @Args('workspaceId') workspaceId: string,
    @Args('page', { nullable: true }) page: number = 1,
    @Args('pageSize', { nullable: true }) pageSize: number = 20,
    @CurrentUser() user: User,
  ): Promise<AssetDto[]> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    const skip = (page - 1) * pageSize;
    const result = await this.assetService.listAssetsByWorkspace(
      workspaceId,
      skip,
      pageSize,
    );

    return result.assets.map((a) => this.toDto(a));
  }

  @Query(() => AssetSearchResponse)
  @UseGuards(JwtAuthGuard)
  async searchAssets(
    @Args('workspaceId') workspaceId: string,
    @Args('input') input: AssetSearchInput,
    @CurrentUser() user: User,
  ): Promise<AssetSearchResponse> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    const result = await this.assetSearchService.searchAssets(
      workspaceId,
      {
        query: input.query,
        modality: input.modality as any,
        tags: input.tags,
        from: input.from,
        size: input.size || 20,
      },
    );

    return {
      assets: result.assets.map((a) => this.toDto(a)),
      total: result.total,
      query: result.query,
      searchType: result.searchType,
    };
  }

  @Query(() => [AssetDto])
  @UseGuards(JwtAuthGuard)
  async similarAssets(
    @Args('assetId') assetId: string,
    @Args('workspaceId') workspaceId: string,
    @Args('limit', { nullable: true }) limit: number = 10,
    @CurrentUser() user: User,
  ): Promise<AssetDto[]> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    const similar = await this.assetSearchService.findSimilarAssets(
      assetId,
      limit,
    );

    return similar.map((a) => this.toDto(a));
  }

  @Mutation(() => PresignedUrlResponse)
  @UseGuards(JwtAuthGuard)
  async getPresignedUploadUrl(
    @Args('workspaceId') workspaceId: string,
    @Args('fileName') fileName: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponse> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    return this.assetUploadService.getPresignedUploadUrl(
      workspaceId,
      fileName,
    );
  }

  @Mutation(() => AssetDto)
  @UseGuards(JwtAuthGuard)
  async uploadAsset(
    @Args('workspaceId') workspaceId: string,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Args('description', { nullable: true }) description?: string,
    @CurrentUser() user: User = null,
  ): Promise<AssetDto> {
    if (!user) {
      throw new BadRequestException('User not authenticated');
    }

    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);

    const buffer = await this.readStream(file.createReadStream());

    const asset = await this.assetUploadService.uploadAsset({
      name: file.filename,
      file: buffer,
      mimeType: file.mimetype,
      size: buffer.length,
      workspaceId,
      description,
    });

    return this.toDto(asset);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteAsset(
    @Args('id') id: string,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    await this.assetUploadService.deleteAsset(id);
    return true;
  }

  private toDto(asset: any): AssetDto {
    return {
      id: asset.id,
      name: asset.name,
      description: asset.description,
      modality: asset.modality,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      s3Url: asset.s3Url,
      tags: asset.tags,
      duration: asset.duration,
      width: asset.width,
      height: asset.height,
      isPublished: asset.isPublished,
      workspaceId: asset.workspaceId,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }

  private async readStream(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}

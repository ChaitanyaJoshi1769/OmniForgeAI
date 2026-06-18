import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Asset } from '../entities/asset.entity';
import { AssetVersion } from '../entities/asset-version.entity';
import { AssetRepository } from '../repositories/asset.repository';
import { CreateAssetInput, UpdateAssetInput } from '../dto/asset.dto';
import { AssetModality, getAssetModalityFromMimeType } from '../../common/enums/asset-modality.enum';

@Injectable()
export class AssetService {
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: Set<string>;

  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 5 * 1024 * 1024 * 1024); // 5GB default
    this.allowedMimeTypes = new Set(
      this.configService.get('ALLOWED_MIME_TYPES', '*/*').split(','),
    );
  }

  async createAsset(
    input: CreateAssetInput,
    workspaceId: string,
  ): Promise<Asset> {
    return this.assetRepository.create({
      name: input.name,
      description: input.description,
      workspaceId,
      tags: input.tags || [],
      mimeType: 'application/octet-stream', // Will be updated on upload
      fileSize: 0, // Will be updated on upload
      s3Key: '', // Will be updated on upload
      modality: AssetModality.OTHER, // Will be updated on upload
    });
  }

  async updateAsset(
    id: string,
    input: UpdateAssetInput,
    workspaceId: string,
  ): Promise<Asset> {
    const asset = await this.getAsset(id, workspaceId);

    return this.assetRepository.update(id, {
      name: input.name,
      description: input.description,
      tags: input.tags,
      isPublished: input.isPublished,
    });
  }

  async getAsset(id: string, workspaceId: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);

    if (!asset || asset.workspaceId !== workspaceId) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async getAssetWithVersions(id: string, workspaceId: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);

    if (!asset || asset.workspaceId !== workspaceId) {
      throw new NotFoundException('Asset not found');
    }

    // Load versions separately if needed
    return asset;
  }

  async listAssetsByWorkspace(
    workspaceId: string,
    skip = 0,
    take = 50,
  ): Promise<{ assets: Asset[]; total: number }> {
    const [assets, total] = await this.assetRepository.findByWorkspace(
      workspaceId,
      skip,
      take,
    );

    return { assets, total };
  }

  async searchAssets(
    workspaceId: string,
    query: string,
    skip = 0,
    take = 50,
  ): Promise<{ assets: Asset[]; total: number }> {
    const [assets, total] = await this.assetRepository.searchByWorkspace(
      workspaceId,
      query,
      skip,
      take,
    );

    return { assets, total };
  }

  async filterByModality(
    workspaceId: string,
    modality: AssetModality,
    skip = 0,
    take = 50,
  ): Promise<{ assets: Asset[]; total: number }> {
    const [assets, total] = await this.assetRepository.findByWorkspaceAndModality(
      workspaceId,
      modality,
      skip,
      take,
    );

    return { assets, total };
  }

  async deleteAsset(id: string, workspaceId: string): Promise<boolean> {
    const asset = await this.getAsset(id, workspaceId);
    return this.assetRepository.delete(id);
  }

  async archiveAsset(id: string, workspaceId: string): Promise<Asset> {
    const asset = await this.getAsset(id, workspaceId);

    return this.assetRepository.update(id, {
      archivedAt: new Date(),
      isActive: false,
    });
  }

  async publishAsset(id: string, workspaceId: string): Promise<Asset> {
    const asset = await this.getAsset(id, workspaceId);

    return this.assetRepository.update(id, {
      isPublished: true,
    });
  }

  async unpublishAsset(id: string, workspaceId: string): Promise<Asset> {
    const asset = await this.getAsset(id, workspaceId);

    return this.assetRepository.update(id, {
      isPublished: false,
    });
  }

  validateFile(fileSize: number, mimeType: string): void {
    if (fileSize > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024 / 1024}GB`,
      );
    }

    if (this.allowedMimeTypes.has('*/*') === false) {
      if (!this.allowedMimeTypes.has(mimeType)) {
        throw new BadRequestException(
          `File type ${mimeType} is not allowed`,
        );
      }
    }
  }

  getAssetModalityFromFile(mimeType: string): AssetModality {
    return getAssetModalityFromMimeType(mimeType);
  }
}

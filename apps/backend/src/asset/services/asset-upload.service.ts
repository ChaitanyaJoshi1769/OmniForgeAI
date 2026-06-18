import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Asset } from '../entities/asset.entity';
import { AssetRepository } from '../repositories/asset.repository';
import { StorageService } from '../../common/services/storage.service';
import { VectorSearchService } from '../../common/services/vector-search.service';
import { SearchService } from '../../common/services/search.service';
import { AssetModality, getAssetModalityFromMimeType } from '../../common/enums/asset-modality.enum';
import * as crypto from 'crypto';

export interface AssetUploadRequest {
  name: string;
  file: Buffer;
  mimeType: string;
  size: number;
  workspaceId: string;
  tags?: string[];
  description?: string;
}

@Injectable()
export class AssetUploadService {
  private readonly maxFileSize: number;

  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly storageService: StorageService,
    private readonly vectorSearchService: VectorSearchService,
    private readonly searchService: SearchService,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSize = configService.get('MAX_FILE_SIZE', 5 * 1024 * 1024 * 1024);
  }

  /**
   * Upload an asset and store it
   */
  async uploadAsset(request: AssetUploadRequest): Promise<Asset> {
    // Validate file
    this.validateFile(request.size, request.mimeType);

    // Determine modality
    const modality = getAssetModalityFromMimeType(request.mimeType);

    // Generate S3 key
    const s3Key = this.generateS3Key(request.workspaceId, request.name);

    // Upload to storage
    await this.storageService.uploadFile(s3Key, request.file, {
      mimeType: request.mimeType,
      originalName: request.name,
      uploadedAt: new Date().toISOString(),
    });

    // Create asset record
    const asset = await this.assetRepository.create({
      name: request.name,
      description: request.description,
      workspaceId: request.workspaceId,
      modality,
      mimeType: request.mimeType,
      fileSize: request.size,
      s3Key,
      tags: request.tags || [],
    });

    // Index in full-text search
    await this.indexAsset(asset);

    // Generate embedding for semantic search if applicable
    if (this.isTextualAsset(modality)) {
      await this.generateAndIndexEmbedding(asset, request.file);
    }

    // Generate thumbnail for visual assets
    if (this.isVisualAsset(modality)) {
      await this.generateThumbnail(asset);
    }

    return asset;
  }

  /**
   * Get presigned upload URL for direct S3 upload
   */
  async getPresignedUploadUrl(
    workspaceId: string,
    fileName: string,
  ): Promise<{ url: string; key: string }> {
    const s3Key = this.generateS3Key(workspaceId, fileName);
    const url = await this.storageService.generateUploadUrl(s3Key, {
      expiresIn: 3600, // 1 hour
    });

    return { url, key: s3Key };
  }

  /**
   * Get presigned download URL
   */
  async getPresignedDownloadUrl(assetId: string): Promise<string> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new BadRequestException('Asset not found');
    }

    return this.storageService.generateDownloadUrl(asset.s3Key, {
      expiresIn: 86400, // 24 hours
    });
  }

  /**
   * Delete asset and all related data
   */
  async deleteAsset(assetId: string): Promise<void> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new BadRequestException('Asset not found');
    }

    // Delete from storage
    await this.storageService.deleteFile(asset.s3Key);

    // Delete thumbnail if exists
    if (asset.thumbnailS3Key) {
      await this.storageService.deleteFile(asset.thumbnailS3Key);
    }

    // Delete from search indices
    await this.searchService.deleteDocument('assets', assetId);
    await this.vectorSearchService.deleteDocument(assetId);

    // Delete asset record (soft delete handled by repository)
    await this.assetRepository.delete(assetId);
  }

  private validateFile(fileSize: number, mimeType: string): void {
    if (fileSize > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024 / 1024}GB`,
      );
    }
  }

  private generateS3Key(workspaceId: string, fileName: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const extension = fileName.split('.').pop() || '';
    return `${workspaceId}/assets/${timestamp}-${random}.${extension}`;
  }

  private async indexAsset(asset: Asset): Promise<void> {
    await this.searchService.indexDocument('assets', asset.id, {
      name: asset.name,
      description: asset.description,
      workspaceId: asset.workspaceId,
      modality: asset.modality,
      tags: asset.tags,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
  }

  private async generateAndIndexEmbedding(
    asset: Asset,
    fileBuffer: Buffer,
  ): Promise<void> {
    try {
      // Extract text from file (PDF, documents, etc.)
      const text = await this.extractText(fileBuffer, asset.mimeType);

      if (text) {
        // Generate embedding
        const embedding = await this.vectorSearchService.generateEmbedding(text);

        // Index in vector store
        await this.vectorSearchService.indexDocument(
          asset.id,
          text,
          embedding,
          {
            assetId: asset.id,
            workspaceId: asset.workspaceId,
            modality: asset.modality,
          },
        );

        // Update asset with embedding
        await this.assetRepository.update(asset.id, {
          embedding: JSON.stringify(embedding),
        });
      }
    } catch (error) {
      // Log error but don't fail asset upload
      console.error('Failed to generate embedding:', error);
    }
  }

  private async generateThumbnail(asset: Asset): Promise<void> {
    try {
      const thumbnailKey = asset.s3Key.replace(/\.[^/.]+$/, '-thumb.jpg');
      await this.storageService.generateThumbnail(
        asset.s3Key,
        thumbnailKey,
        200,
        200,
      );

      // Update asset with thumbnail
      await this.assetRepository.update(asset.id, {
        thumbnailS3Key: thumbnailKey,
      });
    } catch (error) {
      // Log error but don't fail asset upload
      console.error('Failed to generate thumbnail:', error);
    }
  }

  private async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    // TODO: Implement text extraction for different file types
    // PDF: use pdfparse
    // Word: use mammoth
    // Images: use Tesseract OCR
    // Documents: use appropriate libraries
    return '';
  }

  private isTextualAsset(modality: AssetModality): boolean {
    return [
      AssetModality.TEXT,
      AssetModality.DOCUMENT,
      AssetModality.CODE,
    ].includes(modality);
  }

  private isVisualAsset(modality: AssetModality): boolean {
    return [
      AssetModality.IMAGE,
      AssetModality.ILLUSTRATION,
      AssetModality.VECTOR,
    ].includes(modality);
  }
}

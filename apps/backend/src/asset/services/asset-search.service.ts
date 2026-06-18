import { Injectable } from '@nestjs/common';
import { AssetRepository } from '../repositories/asset.repository';
import { SearchService } from '../../common/services/search.service';
import { VectorSearchService } from '../../common/services/vector-search.service';
import { Asset } from '../entities/asset.entity';
import { AssetModality } from '../../common/enums/asset-modality.enum';

export interface AssetSearchOptions {
  query?: string;
  modality?: AssetModality;
  tags?: string[];
  from?: number;
  size?: number;
  sortBy?: 'relevance' | 'createdAt' | 'updatedAt' | 'fileSize' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface AssetSearchResult {
  assets: Asset[];
  total: number;
  query?: string;
  searchType: 'semantic' | 'fulltext' | 'database';
}

@Injectable()
export class AssetSearchService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly searchService: SearchService,
    private readonly vectorSearchService: VectorSearchService,
  ) {}

  /**
   * Search assets with multiple search strategies
   */
  async searchAssets(
    workspaceId: string,
    options: AssetSearchOptions,
  ): Promise<AssetSearchResult> {
    // If text query provided, try semantic search first, fallback to full-text
    if (options.query) {
      return this.semanticSearch(workspaceId, options);
    }

    // Otherwise use database filtering
    return this.databaseSearch(workspaceId, options);
  }

  /**
   * Semantic search using vector embeddings
   */
  async semanticSearch(
    workspaceId: string,
    options: AssetSearchOptions,
  ): Promise<AssetSearchResult> {
    try {
      // Generate embedding for query
      const embedding = await this.vectorSearchService.generateEmbedding(
        options.query!,
      );

      // Search in vector store
      const vectorResults = await this.vectorSearchService.hybridSearch(
        embedding,
        { workspaceId, modality: options.modality },
        options.size || 20,
      );

      // Fetch actual assets from database
      const assetIds = vectorResults.map((r) => r.id);
      const assets = await this.assetRepository.repository.findByIds(assetIds);

      return {
        assets,
        total: assets.length,
        query: options.query,
        searchType: 'semantic',
      };
    } catch (error) {
      // Fallback to full-text search if semantic search fails
      return this.fullTextSearch(workspaceId, options);
    }
  }

  /**
   * Full-text search using Elasticsearch
   */
  async fullTextSearch(
    workspaceId: string,
    options: AssetSearchOptions,
  ): Promise<AssetSearchResult> {
    try {
      const results = await this.searchService.searchAssets(
        workspaceId,
        options.query || '',
        {
          modality: options.modality,
          tags: options.tags,
        },
        options.size || 20,
      );

      const assetIds = results.map((r) => r.id);
      const assets = await this.assetRepository.repository.findByIds(assetIds);

      return {
        assets,
        total: assets.length,
        query: options.query,
        searchType: 'fulltext',
      };
    } catch (error) {
      // Fallback to database search if full-text search fails
      return this.databaseSearch(workspaceId, options);
    }
  }

  /**
   * Database search using SQL queries
   */
  async databaseSearch(
    workspaceId: string,
    options: AssetSearchOptions,
  ): Promise<AssetSearchResult> {
    // Build query based on options
    if (options.query) {
      return {
        assets: (await this.assetRepository.searchByWorkspace(
          workspaceId,
          options.query,
          options.from || 0,
          options.size || 20,
        ))[0],
        total: (await this.assetRepository.searchByWorkspace(
          workspaceId,
          options.query,
          options.from || 0,
          options.size || 20,
        ))[1],
        query: options.query,
        searchType: 'database',
      };
    }

    if (options.modality) {
      return {
        assets: (await this.assetRepository.findByWorkspaceAndModality(
          workspaceId,
          options.modality,
          options.from || 0,
          options.size || 20,
        ))[0],
        total: (await this.assetRepository.findByWorkspaceAndModality(
          workspaceId,
          options.modality,
          options.from || 0,
          options.size || 20,
        ))[1],
        searchType: 'database',
      };
    }

    // Default: list all assets
    return {
      assets: (await this.assetRepository.findByWorkspace(
        workspaceId,
        options.from || 0,
        options.size || 20,
      ))[0],
      total: (await this.assetRepository.findByWorkspace(
        workspaceId,
        options.from || 0,
        options.size || 20,
      ))[1],
      searchType: 'database',
    };
  }

  /**
   * Get similar assets based on vector similarity
   */
  async findSimilarAssets(
    assetId: string,
    limit: number = 10,
  ): Promise<Asset[]> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset || !asset.embedding) {
      return [];
    }

    const embedding = JSON.parse(asset.embedding);
    const results = await this.vectorSearchService.search(
      embedding,
      limit,
      0.5,
    );

    const similarIds = results
      .map((r) => r.id)
      .filter((id) => id !== assetId);

    return this.assetRepository.repository.findByIds(similarIds);
  }

  /**
   * Autocomplete for asset names and tags
   */
  async autocomplete(
    workspaceId: string,
    prefix: string,
    field: 'name' | 'tags' = 'name',
  ): Promise<string[]> {
    return this.searchService.autocomplete(
      'assets',
      field,
      prefix,
      10,
    );
  }

  /**
   * Get asset statistics for workspace
   */
  async getAssetStats(workspaceId: string): Promise<Record<string, any>> {
    return this.searchService.aggregate(
      'assets',
      {
        by_modality: {
          terms: { field: 'modality' },
        },
        total_size: {
          sum: { field: 'fileSize' },
        },
        recent_assets: {
          max: { field: 'createdAt' },
        },
      },
      { workspaceId },
    );
  }
}

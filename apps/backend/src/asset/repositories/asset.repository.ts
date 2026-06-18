import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { BaseRepository } from '../../common/repositories/base.repository';
import { AssetModality } from '../../common/enums/asset-modality.enum';

@Injectable()
export class AssetRepository extends BaseRepository<Asset> {
  constructor(
    @InjectRepository(Asset)
    repository: Repository<Asset>,
  ) {
    super(repository);
  }

  async findByWorkspace(
    workspaceId: string,
    skip = 0,
    take = 50,
  ): Promise<[Asset[], number]> {
    return this.repository.findAndCount({
      where: { workspaceId } as FindOptionsWhere<Asset>,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findByWorkspaceAndModality(
    workspaceId: string,
    modality: AssetModality,
    skip = 0,
    take = 50,
  ): Promise<[Asset[], number]> {
    return this.repository.findAndCount({
      where: { workspaceId, modality } as FindOptionsWhere<Asset>,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async searchByWorkspace(
    workspaceId: string,
    query: string,
    skip = 0,
    take = 50,
  ): Promise<[Asset[], number]> {
    return this.repository.findAndCount({
      where: {
        workspaceId,
        name: ILike(`%${query}%`),
      } as FindOptionsWhere<Asset>,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findByTags(
    workspaceId: string,
    tags: string[],
  ): Promise<Asset[]> {
    // Using raw query for array containment
    return this.repository.query(
      `SELECT * FROM assets WHERE "workspaceId" = $1 AND tags && $2`,
      [workspaceId, tags],
    );
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.repository.count({
      where: { workspaceId } as FindOptionsWhere<Asset>,
    });
  }

  async getTotalSize(workspaceId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('asset')
      .select('SUM(asset.fileSize)', 'totalSize')
      .where('asset.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    return parseInt(result?.totalSize || '0', 10);
  }
}

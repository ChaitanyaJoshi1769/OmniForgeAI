import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { VideoAsset } from '../entities/video-asset.entity';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class VideoAssetRepository extends BaseRepository<VideoAsset> {
  constructor(
    @InjectRepository(VideoAsset)
    repository: Repository<VideoAsset>,
  ) {
    super(repository);
  }

  async findByWorkspace(
    workspaceId: string,
    skip = 0,
    take = 50,
  ): Promise<[VideoAsset[], number]> {
    return this.repository.findAndCount({
      where: { workspaceId } as FindOptionsWhere<VideoAsset>,
      skip,
      take,
      relations: ['segments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findGeneratedVideos(workspaceId: string): Promise<VideoAsset[]> {
    return this.repository.find({
      where: { workspaceId, aiGeneratedAt: { $ne: null } } as any,
      order: { aiGeneratedAt: 'DESC' },
    });
  }

  async findByDuration(
    workspaceId: string,
    minDuration: number,
    maxDuration: number,
  ): Promise<VideoAsset[]> {
    return this.repository.find({
      where: {
        workspaceId,
        duration: { $gte: minDuration, $lte: maxDuration },
      } as any,
    });
  }

  async findByResolution(
    workspaceId: string,
    width: number,
    height: number,
  ): Promise<VideoAsset[]> {
    return this.repository.find({
      where: { workspaceId, width, height } as FindOptionsWhere<VideoAsset>,
    });
  }
}

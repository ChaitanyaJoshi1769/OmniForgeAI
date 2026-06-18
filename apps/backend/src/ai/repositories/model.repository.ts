import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Model } from '../entities/model.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class ModelRepository extends BaseRepository<Model> {
  constructor(
    @InjectRepository(Model)
    repository: Repository<Model>,
  ) {
    super(repository);
  }

  async findByProviderAndId(
    provider: string,
    modelId: string,
  ): Promise<Model | null> {
    return this.repository.findOne({
      where: { provider, modelId } as FindOptionsWhere<Model>,
    });
  }

  async findByProvider(provider: string): Promise<Model[]> {
    return this.repository.find({
      where: { provider, isActive: true } as FindOptionsWhere<Model>,
      order: { name: 'ASC' },
    });
  }

  async findByModality(modality: string): Promise<Model[]> {
    return this.repository.find({
      where: { modality, isActive: true } as FindOptionsWhere<Model>,
      order: { averageLatencyMs: 'ASC' },
    });
  }

  async findByInputOutputModality(
    inputModality: string,
    outputModality: string,
  ): Promise<Model[]> {
    return this.repository.find({
      where: {
        inputModality,
        outputModality,
        isActive: true,
      } as FindOptionsWhere<Model>,
      order: { averageLatencyMs: 'ASC' },
    });
  }

  async findPublicModels(): Promise<Model[]> {
    return this.repository.find({
      where: { isPublic: true, isActive: true } as FindOptionsWhere<Model>,
      order: { provider: 'ASC', name: 'ASC' },
    });
  }

  async findCheapestModel(modality: string): Promise<Model | null> {
    return this.repository.findOne({
      where: { modality, isActive: true } as FindOptionsWhere<Model>,
      order: { costPer1kInputTokens: 'ASC' },
    });
  }

  async findFastestModel(modality: string): Promise<Model | null> {
    return this.repository.findOne({
      where: { modality, isActive: true } as FindOptionsWhere<Model>,
      order: { averageLatencyMs: 'ASC' },
    });
  }

  async findMostReliableModel(modality: string): Promise<Model | null> {
    return this.repository.findOne({
      where: { modality, isActive: true } as FindOptionsWhere<Model>,
      order: { uptime: 'DESC', averageLatencyMs: 'ASC' },
    });
  }
}

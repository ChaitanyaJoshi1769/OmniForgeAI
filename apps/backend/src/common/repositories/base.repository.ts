import {
  FindOptionsWhere,
  FindOptions,
  Repository,
  DeepPartial,
  SaveOptions,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T | null> {
    return this.repository.findOne({
      where,
      relations,
    });
  }

  async findMany(options: FindOptions<T> = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAndCount(
    options: FindOptions<T> = {},
  ): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data as any);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore(id);
    return result.affected ? result.affected > 0 : false;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

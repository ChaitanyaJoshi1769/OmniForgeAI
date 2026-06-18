import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor(
    @InjectRepository(Workspace)
    repository: Repository<Workspace>,
  ) {
    super(repository);
  }

  async findBySlug(
    organizationId: string,
    slug: string,
  ): Promise<Workspace | null> {
    return this.repository.findOne({
      where: { organizationId, slug } as FindOptionsWhere<Workspace>,
    });
  }

  async findByOrganization(
    organizationId: string,
    relations?: string[],
  ): Promise<Workspace[]> {
    return this.repository.find({
      where: { organizationId } as FindOptionsWhere<Workspace>,
      relations,
    });
  }

  async countByOrganization(organizationId: string): Promise<number> {
    return this.repository.count({
      where: { organizationId } as FindOptionsWhere<Workspace>,
    });
  }
}

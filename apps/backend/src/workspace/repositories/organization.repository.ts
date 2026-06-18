import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(
    @InjectRepository(Organization)
    repository: Repository<Organization>,
  ) {
    super(repository);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.repository.findOne({
      where: { slug } as FindOptionsWhere<Organization>,
    });
  }

  async findBySlugWithRelations(
    slug: string,
    relations?: string[],
  ): Promise<Organization | null> {
    return this.repository.findOne({
      where: { slug } as FindOptionsWhere<Organization>,
      relations,
    });
  }

  async findByIdWithRelations(
    id: string,
    relations?: string[],
  ): Promise<Organization | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<Organization>,
      relations,
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { slug } as FindOptionsWhere<Organization>,
    });
    return count > 0;
  }
}

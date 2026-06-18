import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class WorkspaceMemberRepository extends BaseRepository<WorkspaceMember> {
  constructor(
    @InjectRepository(WorkspaceMember)
    repository: Repository<WorkspaceMember>,
  ) {
    super(repository);
  }

  async findByUserAndWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null> {
    return this.repository.findOne({
      where: { userId, workspaceId } as FindOptionsWhere<WorkspaceMember>,
    });
  }

  async findByUser(userId: string): Promise<WorkspaceMember[]> {
    return this.repository.find({
      where: { userId, isActive: true } as FindOptionsWhere<WorkspaceMember>,
    });
  }

  async findByWorkspace(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.repository.find({
      where: { workspaceId } as FindOptionsWhere<WorkspaceMember>,
      relations: ['user'],
    });
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.repository.count({
      where: { workspaceId } as FindOptionsWhere<WorkspaceMember>,
    });
  }
}

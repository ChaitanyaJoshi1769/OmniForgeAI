import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Invitation } from '../entities/invitation.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class InvitationRepository extends BaseRepository<Invitation> {
  constructor(
    @InjectRepository(Invitation)
    repository: Repository<Invitation>,
  ) {
    super(repository);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    return this.repository.findOne({
      where: { token } as FindOptionsWhere<Invitation>,
      relations: ['organization', 'workspace'],
    });
  }

  async findByEmail(email: string): Promise<Invitation[]> {
    return this.repository.find({
      where: { email } as FindOptionsWhere<Invitation>,
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrganization(organizationId: string): Promise<Invitation[]> {
    return this.repository.find({
      where: { organizationId } as FindOptionsWhere<Invitation>,
      order: { createdAt: 'DESC' },
    });
  }

  async findByWorkspace(workspaceId: string): Promise<Invitation[]> {
    return this.repository.find({
      where: { workspaceId } as FindOptionsWhere<Invitation>,
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(): Promise<Invitation[]> {
    return this.repository.find({
      where: {
        isAccepted: false,
      } as FindOptionsWhere<Invitation>,
    });
  }
}

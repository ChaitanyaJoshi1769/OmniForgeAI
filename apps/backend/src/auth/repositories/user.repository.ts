import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email } as FindOptionsWhere<User>,
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'passwordHash',
        'emailVerified',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findByEmailWithRelations(
    email: string,
    relations: string[] = [],
  ): Promise<User | null> {
    return this.repository.findOne({
      where: { email } as FindOptionsWhere<User>,
      relations,
    });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email, isActive: true } as FindOptionsWhere<User>,
    });
  }

  async findManyByEmail(emails: string[]): Promise<User[]> {
    return this.repository.find({
      where: emails.map((email) => ({ email } as FindOptionsWhere<User>)),
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email } as FindOptionsWhere<User>,
    });
    return count > 0;
  }
}

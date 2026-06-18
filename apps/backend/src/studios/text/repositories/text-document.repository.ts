import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { TextDocument } from '../entities/text-document.entity';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class TextDocumentRepository extends BaseRepository<TextDocument> {
  constructor(
    @InjectRepository(TextDocument)
    repository: Repository<TextDocument>,
  ) {
    super(repository);
  }

  async findByWorkspace(
    workspaceId: string,
    skip = 0,
    take = 50,
  ): Promise<[TextDocument[], number]> {
    return this.repository.findAndCount({
      where: { workspaceId } as FindOptionsWhere<TextDocument>,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async searchByTitle(
    workspaceId: string,
    query: string,
  ): Promise<TextDocument[]> {
    return this.repository.find({
      where: {
        workspaceId,
        title: { $iLike: `%${query}%` },
      } as any,
    });
  }

  async findByType(
    workspaceId: string,
    type: string,
  ): Promise<TextDocument[]> {
    return this.repository.find({
      where: { workspaceId, type } as FindOptionsWhere<TextDocument>,
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(
    workspaceId: string,
  ): Promise<TextDocument[]> {
    return this.repository.find({
      where: { workspaceId, isPublished: true } as FindOptionsWhere<TextDocument>,
      order: { publishedAt: 'DESC' },
    });
  }
}

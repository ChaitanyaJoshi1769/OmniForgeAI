import {
  Resolver,
  Query,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TextDocumentRepository } from '../repositories/text-document.repository';
import { TextGenerationService } from '../services/text-generation.service';
import { TextEditingService } from '../services/text-editing.service';
import { TextDocumentDto, CreateTextDocumentInput, GenerateTextInput, GenerateTextResultDto } from '../dto/text.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { User } from '../../../auth/entities/user.entity';
import { WorkspaceService } from '../../../workspace/services/workspace.service';

@Resolver(() => TextDocumentDto)
export class TextResolver {
  constructor(
    private readonly textRepository: TextDocumentRepository,
    private readonly textGeneration: TextGenerationService,
    private readonly textEditing: TextEditingService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Query(() => [TextDocumentDto])
  @UseGuards(JwtAuthGuard)
  async textDocuments(
    @Args('workspaceId') workspaceId: string,
    @Args('page', { nullable: true }) page: number = 1,
    @Args('pageSize', { nullable: true }) pageSize: number = 20,
    @CurrentUser() user: User,
  ): Promise<TextDocumentDto[]> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    const skip = (page - 1) * pageSize;
    const [docs] = await this.textRepository.findByWorkspace(
      workspaceId,
      skip,
      pageSize,
    );
    return docs.map((d) => this.toDto(d));
  }

  @Query(() => TextDocumentDto)
  @UseGuards(JwtAuthGuard)
  async textDocument(
    @Args('id') id: string,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<TextDocumentDto> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    const doc = await this.textRepository.findById(id);
    if (!doc || doc.workspaceId !== workspaceId) {
      throw new Error('Document not found');
    }
    return this.toDto(doc);
  }

  @Mutation(() => TextDocumentDto)
  @UseGuards(JwtAuthGuard)
  async createTextDocument(
    @Args('workspaceId') workspaceId: string,
    @Args('input') input: CreateTextDocumentInput,
    @CurrentUser() user: User,
  ): Promise<TextDocumentDto> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    const doc = await this.textRepository.create({
      ...input,
      workspaceId,
      wordCount: input.content.split(/\s+/).length,
      characterCount: input.content.length,
    });
    return this.toDto(doc);
  }

  @Mutation(() => GenerateTextResultDto)
  @UseGuards(JwtAuthGuard)
  async generateText(
    @Args('workspaceId') workspaceId: string,
    @Args('input') input: GenerateTextInput,
    @CurrentUser() user: User,
  ): Promise<GenerateTextResultDto> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    const result = await this.textGeneration.generateText({
      ...input,
      workspaceId,
      userId: user.id,
    });
    return {
      content: result.content,
      wordCount: result.wordCount,
      characterCount: result.characterCount,
      model: result.model,
      cost: result.cost,
    };
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async improveText(
    @Args('text') text: string,
    @Args('aspect', { nullable: true }) aspect: string = 'grammar',
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.textEditing.editText({
      text,
      operation: aspect as any,
    }).then((r) => r.edited);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async translateText(
    @Args('text') text: string,
    @Args('targetLanguage') targetLanguage: string,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    return this.textGeneration.translateText(text, targetLanguage, workspaceId);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async summarizeText(
    @Args('text') text: string,
    @Args('length', { nullable: true }) length: string = 'medium',
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    return this.textGeneration.summarizeText(
      text,
      length as any,
      workspaceId,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteTextDocument(
    @Args('id') id: string,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.workspaceService.verifyWorkspaceAccess(workspaceId, user.id);
    return this.textRepository.delete(id);
  }

  private toDto(doc: any): TextDocumentDto {
    return {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      description: doc.description,
      type: doc.type,
      format: doc.format,
      tags: doc.tags,
      tone: doc.tone,
      readingLevelGrade: doc.readingLevelGrade,
      wordCount: doc.wordCount,
      characterCount: doc.characterCount,
      isPublished: doc.isPublished,
      publishedAt: doc.publishedAt,
      aiModel: doc.aiModel,
      workspaceId: doc.workspaceId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

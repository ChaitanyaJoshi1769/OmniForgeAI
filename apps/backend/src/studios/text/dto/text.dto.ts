import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';

@ObjectType()
export class TextDocumentDto {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  type: string;

  @Field()
  format: string;

  @Field(() => [String])
  tags: string[];

  @Field({ nullable: true })
  tone?: string;

  @Field({ nullable: true })
  readingLevelGrade?: number;

  @Field()
  wordCount: number;

  @Field()
  characterCount: number;

  @Field()
  isPublished: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  aiModel?: string;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateTextDocumentInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tone?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

@InputType()
export class GenerateTextInput {
  @Field()
  @IsString()
  prompt: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  length?: string;
}

@ObjectType()
export class GenerateTextResultDto {
  @Field()
  content: string;

  @Field()
  wordCount: number;

  @Field()
  characterCount: number;

  @Field()
  model: string;

  @Field()
  cost: number;
}

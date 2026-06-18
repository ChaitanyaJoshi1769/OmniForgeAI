import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { AssetModality } from '../../common/enums/asset-modality.enum';

@ObjectType()
export class AssetDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  modality: AssetModality;

  @Field()
  mimeType: string;

  @Field()
  fileSize: number;

  @Field({ nullable: true })
  s3Url?: string;

  @Field(() => [String])
  tags: string[];

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  width?: number;

  @Field({ nullable: true })
  height?: number;

  @Field()
  isPublished: boolean;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateAssetInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsString()
  workspaceId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

@InputType()
export class UpdateAssetInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  isPublished?: boolean;
}

@ObjectType()
export class AssetVersionDto {
  @Field()
  id: string;

  @Field()
  versionNumber: number;

  @Field()
  fileSize: number;

  @Field()
  mimeType: string;

  @Field({ nullable: true })
  checksum?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isCurrent: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AssetWithVersionsDto extends AssetDto {
  @Field(() => [AssetVersionDto])
  versions: AssetVersionDto[];
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokensDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;

  @Field()
  tokenType: string;
}

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  emailVerified: boolean;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AuthResponseDto {
  @Field()
  user: UserDto;

  @Field()
  tokens: AuthTokensDto;
}

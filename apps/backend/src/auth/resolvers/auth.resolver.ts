import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResponseDto, UserDto, AuthTokensDto } from '../dto/auth-response.dto';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from '../dto/auth-input.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseDto)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponseDto> {
    if (!input.email || !input.password || !input.firstName || !input.lastName) {
      throw new BadRequestException('Missing required fields');
    }

    const { user, tokens } = await this.authService.register(input);

    return {
      user: this.authService.toDto(user),
      tokens,
    };
  }

  @Mutation(() => AuthResponseDto)
  async login(@Args('input') input: LoginInput): Promise<AuthResponseDto> {
    if (!input.email || !input.password) {
      throw new BadRequestException('Email and password are required');
    }

    const { user, tokens } = await this.authService.login(input);

    return {
      user: this.authService.toDto(user),
      tokens,
    };
  }

  @Mutation(() => AuthTokensDto)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthTokensDto> {
    return this.authService.refreshToken(input.refreshToken);
  }

  @Query(() => UserDto)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<UserDto> {
    return this.authService.toDto(user);
  }
}

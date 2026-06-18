import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { AuthProvider } from '../../common/enums/auth-provider.enum';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async handleOAuthCallback(profile: any): Promise<{ user: User; tokens: any }> {
    const provider = profile.provider as AuthProvider;

    // Find or create user
    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      // Create new user from OAuth profile
      user = await this.userRepository.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        authProviders: [provider],
        isActive: true,
      });
    } else {
      // Add provider if not already present
      if (!user.authProviders.includes(provider)) {
        await this.userRepository.update(user.id, {
          authProviders: [...user.authProviders, provider],
        });
        user = (await this.userRepository.findById(user.id))!;
      }
    }

    // Generate tokens
    const tokens = this.authService.generateTokens(user);

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return { user, tokens };
  }

  async createOAuthUser(
    profile: any,
    provider: AuthProvider,
  ): Promise<User> {
    return this.userRepository.create({
      email: profile.email,
      firstName: profile.firstName || 'User',
      lastName: profile.lastName || '',
      avatar: profile.avatar,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      authProviders: [provider],
      isActive: true,
    });
  }

  validateOAuthProfile(profile: any): void {
    if (!profile.email) {
      throw new BadRequestException('OAuth profile must contain email');
    }
    if (!profile.provider) {
      throw new BadRequestException('OAuth profile must contain provider');
    }
  }
}

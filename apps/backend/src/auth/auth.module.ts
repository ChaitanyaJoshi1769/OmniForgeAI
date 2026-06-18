import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { AuthService } from './services/auth.service';
import { OAuthService } from './services/oauth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOAuthStrategy, GitHubOAuthStrategy, MicrosoftOAuthStrategy } from './strategies/oauth.strategy';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'dev-secret-key-change-in-production',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    OAuthService,
    UserRepository,
    JwtStrategy,
    GoogleOAuthStrategy,
    GitHubOAuthStrategy,
    MicrosoftOAuthStrategy,
    AuthResolver,
  ],
  exports: [AuthService, OAuthService, UserRepository, JwtModule, PassportModule],
})
export class AuthModule {}

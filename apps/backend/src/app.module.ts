import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AssetModule } from './asset/asset.module';
import { AIModule } from './ai/ai.module';
import { TextModule } from './studios/text/text.module';
import { ImageModule } from './studios/image/image.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';
import { User } from './auth/entities/user.entity';
import { ApiKey } from './auth/entities/api-key.entity';
import { Organization } from './workspace/entities/organization.entity';
import { Workspace } from './workspace/entities/workspace.entity';
import { OrganizationMember } from './workspace/entities/organization-member.entity';
import { WorkspaceMember } from './workspace/entities/workspace-member.entity';
import { Invitation } from './workspace/entities/invitation.entity';
import { Asset } from './asset/entities/asset.entity';
import { AssetVersion } from './asset/entities/asset-version.entity';
import { AuditLog } from './common/entities/audit-log.entity';
import { Model } from './ai/entities/model.entity';
import { ModelUsage } from './ai/entities/model-usage.entity';
import { TextDocument } from './studios/text/entities/text-document.entity';
import { TextVersion } from './studios/text/entities/text-version.entity';
import { ImageAsset } from './studios/image/entities/image-asset.entity';
import { ImageVersion } from './studios/image/entities/image-version.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'omniforge',
      entities: [
        User,
        ApiKey,
        Organization,
        Workspace,
        OrganizationMember,
        WorkspaceMember,
        Invitation,
        Asset,
        AssetVersion,
        AuditLog,
        Model,
        ModelUsage,
        TextDocument,
        TextVersion,
        ImageAsset,
        ImageVersion,
      ],
      migrations: ['dist/migrations/*.js'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'development',
      introspection: true,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),

    // Common/Shared modules
    CommonModule,

    // Feature modules
    HealthModule,
    AuthModule,
    WorkspaceModule,
    AssetModule,
    AIModule,
    TextModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

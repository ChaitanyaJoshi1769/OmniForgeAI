import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// Core Modules
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AssetModule } from './asset/asset.module';
import { AIModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';

// Studio Modules
import { TextModule } from './studios/text/text.module';
import { ImageModule } from './studios/image/image.module';
import { VideoModule } from './studios/video/video.module';
import { AudioModule } from './studios/audio/audio.module';
import { DocumentModule } from './studios/document/document.module';
import { CodeModule } from './studios/code/code.module';
import { ThreeDModule } from './studios/threed/threed.module';

// Advanced Modules
import { WorkflowModule } from './advanced/workflow/workflow.module';
import { AgentModule } from './advanced/agents/agents.module';
import { GovernanceModule } from './advanced/governance/governance.module';
import { MarketplaceModule } from './advanced/marketplace/marketplace.module';

// Entities
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
import { VideoAsset } from './studios/video/entities/video-asset.entity';
import { VideoSegment } from './studios/video/entities/video-segment.entity';
import { AudioAsset } from './studios/audio/entities/audio-asset.entity';
import { Document } from './studios/document/entities/document.entity';
import { CodeRepository } from './studios/code/entities/code-repository.entity';
import { Model3D } from './studios/threed/entities/model-3d.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'omniforge',
      entities: [
        User, ApiKey, Organization, Workspace, OrganizationMember, WorkspaceMember, Invitation,
        Asset, AssetVersion, AuditLog, Model, ModelUsage,
        TextDocument, TextVersion, ImageAsset, ImageVersion,
        VideoAsset, VideoSegment, AudioAsset,
        Document, CodeRepository, Model3D,
      ],
      migrations: ['dist/migrations/*.js'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

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

    CommonModule,
    HealthModule,
    AuthModule,
    WorkspaceModule,
    AssetModule,
    AIModule,
    TextModule,
    ImageModule,
    VideoModule,
    AudioModule,
    DocumentModule,
    CodeModule,
    ThreeDModule,
    WorkflowModule,
    AgentModule,
    GovernanceModule,
    MarketplaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetVersion } from './entities/asset-version.entity';
import { AssetRepository } from './repositories/asset.repository';
import { AssetService } from './services/asset.service';
import { AssetUploadService } from './services/asset-upload.service';
import { AssetSearchService } from './services/asset-search.service';
import { AssetResolver } from './resolvers/asset.resolver';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetVersion]),
    WorkspaceModule,
  ],
  providers: [
    AssetRepository,
    AssetService,
    AssetUploadService,
    AssetSearchService,
    AssetResolver,
  ],
  exports: [
    AssetService,
    AssetUploadService,
    AssetSearchService,
    AssetRepository,
  ],
})
export class AssetModule {}

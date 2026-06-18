import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetVersion } from './entities/asset-version.entity';
import { AssetRepository } from './repositories/asset.repository';
import { AssetService } from './services/asset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetVersion]),
  ],
  providers: [
    AssetRepository,
    AssetService,
  ],
  exports: [
    AssetService,
    AssetRepository,
  ],
})
export class AssetModule {}

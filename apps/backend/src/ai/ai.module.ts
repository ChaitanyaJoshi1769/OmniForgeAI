import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { ModelUsage } from './entities/model-usage.entity';
import { ModelRepository } from './repositories/model.repository';
import { ModelRouterService } from './services/model-router.service';
import { LLMService } from './services/llm.service';
import { CostTrackerService } from './services/cost-tracker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, ModelUsage]),
  ],
  providers: [
    ModelRepository,
    ModelRouterService,
    LLMService,
    CostTrackerService,
  ],
  exports: [
    ModelRepository,
    ModelRouterService,
    LLMService,
    CostTrackerService,
  ],
})
export class AIModule {}

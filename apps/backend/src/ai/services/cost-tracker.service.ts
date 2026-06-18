import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelUsage } from '../entities/model-usage.entity';
import { Model } from '../entities/model.entity';

export interface UsageRecord {
  modelId: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
}

@Injectable()
export class CostTrackerService {
  constructor(
    @InjectRepository(ModelUsage)
    private readonly usageRepository: Repository<ModelUsage>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  /**
   * Record model usage and cost
   */
  async recordUsage(record: UsageRecord): Promise<ModelUsage> {
    // Get model details for cost calculation
    const model = await this.modelRepository.findOne({
      where: { modelId: record.modelId },
    });

    if (!model) {
      throw new Error(`Model ${record.modelId} not found`);
    }

    // Calculate cost
    const inputCost =
      (record.inputTokens / 1000) *
      parseFloat(model.costPer1kInputTokens.toString());
    const outputCost =
      (record.outputTokens / 1000) *
      parseFloat(model.costPer1kOutputTokens.toString());
    const totalCost = inputCost + outputCost;

    // Find or create daily usage record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let usage = await this.usageRepository.findOne({
      where: {
        modelId: record.modelId,
        userId: record.userId,
        organizationId: record.organizationId,
        workspaceId: record.workspaceId,
        date: today,
      },
    });

    if (!usage) {
      usage = this.usageRepository.create({
        modelId: record.modelId,
        model,
        userId: record.userId,
        organizationId: record.organizationId,
        workspaceId: record.workspaceId,
        date: today,
        requestCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalCostUSD: 0,
        averageLatencyMs: 0,
        successRate: 100,
      });
    }

    // Update usage
    const previousCount = usage.requestCount;
    const previousLatency = parseFloat(usage.averageLatencyMs.toString());

    usage.requestCount += 1;
    usage.inputTokens += record.inputTokens;
    usage.outputTokens += record.outputTokens;
    usage.totalCostUSD = parseFloat(
      (parseFloat(usage.totalCostUSD.toString()) + totalCost).toFixed(6),
    );
    usage.averageLatencyMs = parseFloat(
      ((previousLatency * previousCount + record.latencyMs) / usage.requestCount).toFixed(2),
    );

    if (record.success) {
      usage.successRate = parseFloat(
        (
          ((parseFloat(usage.successRate.toString()) * previousCount +
            100) /
            usage.requestCount) *
          100
        ).toFixed(2),
      );
    } else {
      usage.successRate = parseFloat(
        (
          (parseFloat(usage.successRate.toString()) * previousCount) /
          usage.requestCount
        ).toFixed(2),
      );
    }

    return this.usageRepository.save(usage);
  }

  /**
   * Get usage for a user
   */
  async getUserUsage(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ModelUsage[]> {
    return this.usageRepository.find({
      where: {
        userId,
        date: { $gte: startDate, $lte: endDate },
      } as any,
      relations: ['model'],
    });
  }

  /**
   * Get usage for an organization
   */
  async getOrganizationUsage(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ModelUsage[]> {
    return this.usageRepository.find({
      where: {
        organizationId,
        date: { $gte: startDate, $lte: endDate },
      } as any,
      relations: ['model'],
    });
  }

  /**
   * Get usage for a workspace
   */
  async getWorkspaceUsage(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ModelUsage[]> {
    return this.usageRepository.find({
      where: {
        workspaceId,
        date: { $gte: startDate, $lte: endDate },
      } as any,
      relations: ['model'],
    });
  }

  /**
   * Get total cost for user
   */
  async getUserCost(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const usage = await this.getUserUsage(userId, startDate, endDate);
    return usage.reduce(
      (total, u) => total + parseFloat(u.totalCostUSD.toString()),
      0,
    );
  }

  /**
   * Get total cost for organization
   */
  async getOrganizationCost(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const usage = await this.getOrganizationUsage(
      organizationId,
      startDate,
      endDate,
    );
    return usage.reduce(
      (total, u) => total + parseFloat(u.totalCostUSD.toString()),
      0,
    );
  }

  /**
   * Get cost breakdown by model
   */
  async getCostByModel(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Record<string, number>> {
    const usage = await this.getOrganizationUsage(
      organizationId,
      startDate,
      endDate,
    );

    const breakdown: Record<string, number> = {};
    for (const record of usage) {
      const modelName = record.model?.name || record.modelId;
      breakdown[modelName] = (breakdown[modelName] || 0) + parseFloat(record.totalCostUSD.toString());
    }

    return breakdown;
  }

  /**
   * Get usage statistics
   */
  async getStatistics(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Record<string, any>> {
    const usage = await this.getOrganizationUsage(
      organizationId,
      startDate,
      endDate,
    );

    const totalTokens = usage.reduce(
      (sum, u) => sum + u.inputTokens + u.outputTokens,
      0,
    );
    const totalCost = usage.reduce(
      (sum, u) => sum + parseFloat(u.totalCostUSD.toString()),
      0,
    );
    const totalRequests = usage.reduce((sum, u) => sum + u.requestCount, 0);
    const avgLatency =
      usage.reduce(
        (sum, u) => sum + parseFloat(u.averageLatencyMs.toString()),
        0,
      ) / (usage.length || 1);
    const avgSuccessRate =
      usage.reduce(
        (sum, u) => sum + parseFloat(u.successRate.toString()),
        0,
      ) / (usage.length || 1);

    return {
      totalTokens,
      totalCost: totalCost.toFixed(2),
      totalRequests,
      avgLatency: avgLatency.toFixed(2),
      avgSuccessRate: avgSuccessRate.toFixed(2),
      costPerRequest: (totalCost / (totalRequests || 1)).toFixed(4),
      costPerToken: (totalCost / (totalTokens || 1)).toFixed(6),
    };
  }
}

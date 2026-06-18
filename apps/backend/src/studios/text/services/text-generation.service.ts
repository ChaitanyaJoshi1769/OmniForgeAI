import { Injectable } from '@nestjs/common';
import { LLMService } from '../../../ai/services/llm.service';
import { ModelRouterService } from '../../../ai/services/model-router.service';
import { CostTrackerService } from '../../../ai/services/cost-tracker.service';

export interface GenerateTextRequest {
  prompt: string;
  type?: string; // blog, email, documentation, etc.
  tone?: string; // professional, casual, creative
  length?: 'short' | 'medium' | 'long'; // target length
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
}

export interface GenerateTextResponse {
  content: string;
  wordCount: number;
  characterCount: number;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
}

@Injectable()
export class TextGenerationService {
  constructor(
    private readonly llmService: LLMService,
    private readonly modelRouter: ModelRouterService,
    private readonly costTracker: CostTrackerService,
  ) {}

  async generateText(
    request: GenerateTextRequest,
  ): Promise<GenerateTextResponse> {
    // Route to best text model
    const modelResult = await this.modelRouter.route({
      inputModality: 'text',
      outputModality: 'text',
      quality: 'high',
      userId: request.userId,
      organizationId: request.organizationId,
    });

    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(
      request.type,
      request.tone,
      request.length,
    );

    // Call LLM
    const completion = await this.llmService.completion({
      model: modelResult.model.modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt },
      ],
      temperature: request.temperature ?? 0.7,
      topP: request.topP,
      maxTokens: request.maxTokens ?? 2000,
    });

    // Count tokens and calculate cost
    const wordCount = completion.content.split(/\s+/).length;
    const characterCount = completion.content.length;

    // TODO: Track usage
    if (request.organizationId) {
      await this.costTracker.recordUsage({
        modelId: modelResult.model.modelId,
        provider: modelResult.model.provider,
        inputTokens: completion.usage?.promptTokens || 0,
        outputTokens: completion.usage?.completionTokens || 0,
        latencyMs: 0,
        success: true,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        userId: request.userId,
      });
    }

    const cost = this.calculateCost(modelResult.model, completion.usage || {});

    return {
      content: completion.content,
      wordCount,
      characterCount,
      model: modelResult.model.modelId,
      usage: completion.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      cost,
    };
  }

  async translateText(
    text: string,
    targetLanguage: string,
    organizationId?: string,
  ): Promise<string> {
    const response = await this.generateText({
      prompt: `Translate the following text to ${targetLanguage}:\n\n${text}`,
      organizationId,
    });

    return response.content;
  }

  async summarizeText(
    text: string,
    length: 'short' | 'medium' | 'long' = 'medium',
    organizationId?: string,
  ): Promise<string> {
    const response = await this.generateText({
      prompt: `Summarize the following text in ${length} form:\n\n${text}`,
      organizationId,
    });

    return response.content;
  }

  async improveWriting(
    text: string,
    aspect: 'grammar' | 'clarity' | 'tone' | 'structure' = 'grammar',
    organizationId?: string,
  ): Promise<string> {
    const response = await this.generateText({
      prompt: `Improve the ${aspect} of the following text:\n\n${text}`,
      organizationId,
    });

    return response.content;
  }

  private buildSystemPrompt(
    type?: string,
    tone?: string,
    length?: string,
  ): string {
    let prompt = 'You are a professional content writer.';

    if (type) {
      prompt += ` You specialize in writing ${type} content.`;
    }

    if (tone) {
      prompt += ` Write in a ${tone} tone.`;
    }

    if (length) {
      const lengthGuide = {
        short: 'Keep your response brief and concise.',
        medium: 'Provide a moderate amount of detail.',
        long: 'Write a comprehensive and detailed response.',
      };
      prompt += ` ${lengthGuide[length as keyof typeof lengthGuide] || ''}`;
    }

    return prompt;
  }

  private calculateCost(model: any, usage: any): number {
    const inputCost =
      (usage.promptTokens || 0) / 1000 *
      parseFloat(model.costPer1kInputTokens.toString());
    const outputCost =
      (usage.completionTokens || 0) / 1000 *
      parseFloat(model.costPer1kOutputTokens.toString());
    return inputCost + outputCost;
  }
}

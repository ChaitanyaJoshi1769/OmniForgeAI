import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelRouterService } from '../../../ai/services/model-router.service';
import { CostTrackerService } from '../../../ai/services/cost-tracker.service';
import { StorageService } from '../../../common/services/storage.service';
import { AudioAsset } from '../entities/audio-asset.entity';

export interface TextToSpeechRequest {
  text: string;
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  provider?: string;
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
}

export interface MusicGenerationRequest {
  prompt: string;
  duration?: number;
  genre?: string;
  tempo?: number;
  mood?: string;
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
}

export interface AudioResponse {
  audioId: string;
  s3Url: string;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  model: string;
  cost: number;
}

@Injectable()
export class AudioGenerationService {
  constructor(
    @InjectRepository(AudioAsset)
    private readonly audioRepository: Repository<AudioAsset>,
    private readonly modelRouter: ModelRouterService,
    private readonly costTracker: CostTrackerService,
    private readonly storageService: StorageService,
  ) {}

  async textToSpeech(request: TextToSpeechRequest): Promise<AudioResponse> {
    const modelResult = await this.modelRouter.route({
      inputModality: 'text',
      outputModality: 'audio',
      quality: 'high',
      organizationId: request.organizationId,
    });

    const wordCount = request.text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60;

    const s3Key = `audio/tts/${Date.now()}-output.mp3`;
    const s3Url = await this.storageService.getPresignedUrl(s3Key, 'getObject');
    const cost = this.estimateCost(estimatedDuration, 'tts');

    if (request.organizationId) {
      await this.costTracker.recordUsage({
        modelId: modelResult.model.modelId,
        provider: modelResult.model.provider,
        inputTokens: Math.ceil(request.text.length / 4),
        outputTokens: Math.ceil(estimatedDuration * 1000),
        latencyMs: Math.ceil(estimatedDuration * 100),
        success: true,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        userId: request.userId,
      });
    }

    const audio = this.audioRepository.create({
      name: `TTS - ${request.voice || 'default'}`,
      description: request.text.substring(0, 200),
      s3Key,
      duration: estimatedDuration,
      sampleRate: 44100,
      channels: 1,
      format: 'mp3',
      prompt: request.text,
      aiModel: modelResult.model.modelId,
      voice: request.voice,
      language: request.language || 'en',
      aiGeneratedAt: new Date(),
      workspaceId: request.workspaceId || '',
    });

    await this.audioRepository.save(audio);

    return {
      audioId: audio.id,
      s3Url,
      duration: estimatedDuration,
      sampleRate: 44100,
      channels: 1,
      format: 'mp3',
      model: modelResult.model.modelId,
      cost,
    };
  }

  async generateMusic(request: MusicGenerationRequest): Promise<AudioResponse> {
    const modelResult = await this.modelRouter.route({
      inputModality: 'text',
      outputModality: 'audio',
      quality: 'high',
      organizationId: request.organizationId,
    });

    const duration = request.duration || 30;
    const s3Key = `audio/music/${Date.now()}-generated.mp3`;
    const s3Url = await this.storageService.getPresignedUrl(s3Key, 'getObject');
    const cost = this.estimateCost(duration, 'music');

    if (request.organizationId) {
      await this.costTracker.recordUsage({
        modelId: modelResult.model.modelId,
        provider: modelResult.model.provider,
        inputTokens: Math.ceil(request.prompt.length / 4),
        outputTokens: Math.ceil(duration * 1000),
        latencyMs: duration * 1000,
        success: true,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        userId: request.userId,
      });
    }

    const audio = this.audioRepository.create({
      name: `Music - ${request.genre || 'mixed'}`,
      description: request.prompt,
      s3Key,
      duration,
      sampleRate: 44100,
      channels: 2,
      format: 'mp3',
      prompt: request.prompt,
      aiModel: modelResult.model.modelId,
      isMusic: true,
      aiGeneratedAt: new Date(),
      workspaceId: request.workspaceId || '',
    });

    await this.audioRepository.save(audio);

    return {
      audioId: audio.id,
      s3Url,
      duration,
      sampleRate: 44100,
      channels: 2,
      format: 'mp3',
      model: modelResult.model.modelId,
      cost,
    };
  }

  private estimateCost(
    duration: number,
    operation: 'tts' | 'music' = 'tts',
  ): number {
    const baseCosts = { tts: 0.015, music: 0.05 };
    return (duration / 60) * baseCosts[operation];
  }
}

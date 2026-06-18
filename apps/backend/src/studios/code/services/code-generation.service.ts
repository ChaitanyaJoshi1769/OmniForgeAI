import { Injectable } from '@nestjs/common';
import { LLMService } from '../../../ai/services/llm.service';

@Injectable()
export class CodeGenerationService {
  constructor(private readonly llmService: LLMService) {}

  async generateCode(prompt: string, language: string): Promise<string> {
    return await this.llmService.completion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 4000,
    }).then(r => r.content);
  }
}

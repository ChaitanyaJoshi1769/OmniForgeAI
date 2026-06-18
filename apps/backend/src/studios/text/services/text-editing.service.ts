import { Injectable } from '@nestjs/common';
import { LLMService } from '../../../ai/services/llm.service';

export interface TextEditRequest {
  text: string;
  operation: 'grammar' | 'style' | 'expand' | 'shorten' | 'paraphrase' | 'simplify';
  language?: string;
}

export interface TextEditResponse {
  original: string;
  edited: string;
  changes: TextChange[];
}

export interface TextChange {
  original: string;
  replacement: string;
  position: number;
  reason: string;
}

@Injectable()
export class TextEditingService {
  constructor(private readonly llmService: LLMService) {}

  async editText(request: TextEditRequest): Promise<TextEditResponse> {
    const prompt = this.buildEditPrompt(request);

    const completion = await this.llmService.completion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      maxTokens: request.text.length * 2,
    });

    // Parse response for changes
    const changes = this.parseChanges(request.text, completion.content);

    return {
      original: request.text,
      edited: completion.content,
      changes,
    };
  }

  async checkGrammar(text: string): Promise<TextChange[]> {
    const response = await this.editText({
      text,
      operation: 'grammar',
    });

    return response.changes;
  }

  async improveStyle(text: string): Promise<string> {
    const response = await this.editText({
      text,
      operation: 'style',
    });

    return response.edited;
  }

  async expandText(text: string): Promise<string> {
    const response = await this.editText({
      text,
      operation: 'expand',
    });

    return response.edited;
  }

  async shortenText(text: string): Promise<string> {
    const response = await this.editText({
      text,
      operation: 'shorten',
    });

    return response.edited;
  }

  async paraphraseText(text: string): Promise<string> {
    const response = await this.editText({
      text,
      operation: 'paraphrase',
    });

    return response.edited;
  }

  async simplifyText(text: string): Promise<string> {
    const response = await this.editText({
      text,
      operation: 'simplify',
    });

    return response.edited;
  }

  private buildEditPrompt(request: TextEditRequest): string {
    const operations = {
      grammar: 'Fix all grammar, spelling, and punctuation errors.',
      style: 'Improve the writing style while maintaining the original meaning.',
      expand: 'Expand the text with more details and examples.',
      shorten: 'Shorten the text while keeping the main points.',
      paraphrase: 'Rewrite the text in different words but keep the same meaning.',
      simplify: 'Simplify the language to make it easier to understand.',
    };

    return `${operations[request.operation]}\n\nText: ${request.text}`;
  }

  private parseChanges(
    original: string,
    edited: string,
  ): TextChange[] {
    // TODO: Implement change detection
    // This would require sophisticated diff algorithms
    // For now, return empty array
    return [];
  }
}

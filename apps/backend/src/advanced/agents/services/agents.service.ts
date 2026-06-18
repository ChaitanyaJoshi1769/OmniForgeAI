import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentsService {
  async execute(input: any): Promise<any> {
    return input;
  }
}

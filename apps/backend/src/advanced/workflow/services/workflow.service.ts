import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  async execute(input: any): Promise<any> {
    return input;
  }
}

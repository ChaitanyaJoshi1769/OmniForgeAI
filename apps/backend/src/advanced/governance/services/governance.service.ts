import { Injectable } from '@nestjs/common';

@Injectable()
export class GovernanceService {
  async execute(input: any): Promise<any> {
    return input;
  }
}

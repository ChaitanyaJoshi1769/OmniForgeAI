import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  async execute(input: any): Promise<any> {
    return input;
  }
}

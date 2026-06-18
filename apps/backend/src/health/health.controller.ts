import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    };
  }

  @Get('ready')
  getReady() {
    return {
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }
}

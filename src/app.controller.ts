import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: this.appService.getHello(),
      status: 'running',
      baseUrl: 'http://localhost:3000/api',
      endpoints: {
        auth: '/api/auth/login',
        managers: '/api/managers',
        approvals: '/api/approvals',
        reviews: '/api/reviews',
      },
    };
  }
}

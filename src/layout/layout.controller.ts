import { Controller, Get, Query } from '@nestjs/common'; // NestJS decorators
import { LayoutService } from './layout.service';

@Controller('layout') // base route: /layout
export class LayoutController {
  constructor(private readonly service: LayoutService) {}

  @Get('menu') // GET /layout/menu?role=coordinator
  getMenu(@Query('role') role: string) {
    return this.service.getMenu(role); // returns menu items array
  }
}

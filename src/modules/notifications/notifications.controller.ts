import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query('managerId') managerId?: string) {
    return this.notificationsService.findAll(managerId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Patch('mark-all-read')
  markAllRead(@Body() body: { managerId: string }) {
    return this.notificationsService.markAllRead(body.managerId);
  }

  @Post()
  create(@Body() body: any) {
    return this.notificationsService.create(body);
  }
}
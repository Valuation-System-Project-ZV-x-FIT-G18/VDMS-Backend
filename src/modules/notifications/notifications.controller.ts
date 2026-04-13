import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications?recipientId=client-001
  @Get()
  getForUser(@Query('recipientId') recipientId: string) {
    return this.notificationsService.getForUser(recipientId);
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // PATCH /notifications/mark-all-read?recipientId=client-001
  @Patch('mark-all-read')
  markAllAsRead(@Query('recipientId') recipientId: string) {
    return this.notificationsService.markAllAsRead(recipientId);
  }
}

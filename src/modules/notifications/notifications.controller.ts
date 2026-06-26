import { Body, Controller, Get, Patch, Param, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationEvent, NotificationType } from '../../entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Body('type') type: NotificationType,
    @Body('event') event: NotificationEvent,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('recipientId') recipientId: string,
    @Body('recipientRole') recipientRole: string,
    @Body('projectId') projectId?: string,
  ) {
    return this.notificationsService.create({
      type,
      event,
      title,
      message,
      recipientId,
      recipientRole,
      projectId,
    });
  }

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

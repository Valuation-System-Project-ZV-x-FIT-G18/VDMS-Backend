import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  findAll(managerId?: string) {
    if (managerId) return this.notificationRepository.find({ where: { managerId } });
    return this.notificationRepository.find({ order: { created_at: 'DESC' } });
  }

  async markRead(id: string) {
    await this.notificationRepository.update(id, { isRead: true });
    return { success: true };
  }

  async markAllRead(managerId: string) {
    await this.notificationRepository.update({ managerId }, { isRead: true });
    return { success: true };
  }

  create(data: Partial<Notification>) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }
}
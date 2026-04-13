import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  NotificationEvent,
} from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // Get all notifications for a user
  async getForUser(recipientId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipientId },
      order: { createdAt: 'DESC' },
    });
  }

  // Mark one notification as read
  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (notification) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }
    return null;
  }

  // Mark all notifications as read for a user
  async markAllAsRead(recipientId: string): Promise<void> {
    await this.notificationRepository.update({ recipientId }, { isRead: true });
  }

  // Core method - create a notification
  async create(data: {
    type: NotificationType;
    event: NotificationEvent;
    title: string;
    message: string;
    recipientId: string;
    recipientRole: string;
    projectId?: string;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  // Trigger: Project Created
  async notifyProjectCreated(project: {
    id: string;
    projectId: string;
    propertyAddress: string;
    clientId: string;
  }): Promise<void> {
    await this.create({
      type: NotificationType.SUCCESS,
      event: NotificationEvent.PROJECT_CREATED,
      title: `Valuation Job Created â€“ ${project.projectId}`,
      message: `A new valuation job has been created for the property at ${project.propertyAddress}. Your job reference is ${project.projectId}.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }

  // Trigger: Document Missing
  async notifyDocumentMissing(project: {
    id: string;
    projectId: string;
    clientId: string;
    missingDocs: string[];
  }): Promise<void> {
    await this.create({
      type: NotificationType.WARNING,
      event: NotificationEvent.DOCUMENT_MISSING,
      title: `Documents Missing â€“ ${project.projectId}`,
      message: `The following documents are still pending for ${project.projectId}: ${project.missingDocs.join(', ')}. Please upload them to proceed.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }

  // Trigger: Report Ready
  async notifyReportReady(project: {
    id: string;
    projectId: string;
    clientId: string;
    propertyAddress: string;
  }): Promise<void> {
    await this.create({
      type: NotificationType.SUCCESS,
      event: NotificationEvent.REPORT_PREPARED,
      title: `Valuation Report Ready â€“ ${project.projectId}`,
      message: `The valuation report for the property at ${project.propertyAddress} is now complete and ready for your review.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }

  // Trigger: Payment Due
  async notifyPaymentDue(project: {
    id: string;
    projectId: string;
    clientId: string;
    amount: number;
    dueDate: string;
  }): Promise<void> {
    await this.create({
      type: NotificationType.ERROR,
      event: NotificationEvent.PAYMENT_DUE,
      title: `Payment Due â€“ ${project.projectId}`,
      message: `Invoice of LKR ${project.amount.toLocaleString()} for project ${project.projectId} is due on ${project.dueDate}. Please process the payment to avoid delays.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }

  // Trigger: Stage Changed
  async notifyStageChanged(project: {
    id: string;
    projectId: string;
    clientId: string;
    newStage: string;
    propertyAddress: string;
  }): Promise<void> {
    await this.create({
      type: NotificationType.INFO,
      event: NotificationEvent.STAGE_CHANGED,
      title: `Project Update â€“ ${project.projectId}`,
      message: `Your valuation project for ${project.propertyAddress} has moved to the "${project.newStage}" stage.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }

  // Trigger: Project Completed
  async notifyProjectCompleted(project: {
    id: string;
    projectId: string;
    clientId: string;
    propertyAddress: string;
  }): Promise<void> {
    await this.create({
      type: NotificationType.SUCCESS,
      event: NotificationEvent.PROJECT_COMPLETED,
      title: `Project Completed â€“ ${project.projectId}`,
      message: `Valuation project ${project.projectId} for the property at ${project.propertyAddress} has been successfully completed.`,
      recipientId: project.clientId,
      recipientRole: 'bank_credit_officer',
      projectId: project.id,
    });
  }
}

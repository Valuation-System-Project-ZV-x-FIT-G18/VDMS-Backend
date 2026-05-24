import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  NotificationEvent,
} from '../../entities/notification.entity';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  // Get all notifications for a user
  async getForUser(recipientId: string): Promise<Notification[]> {
    await this.syncWorkflowNotifications(recipientId);
    await this.syncUnpaidInvoiceReminders(recipientId);

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

  private async createIfMissing(data: {
    type: NotificationType;
    event: NotificationEvent;
    title: string;
    message: string;
    recipientId: string;
    recipientRole: string;
    projectId?: string;
  }): Promise<void> {
    const existing = await this.notificationRepository.findOne({
      where: {
        recipientId: data.recipientId,
        event: data.event,
        title: data.title,
      },
    });

    if (existing) {
      return;
    }

    await this.create(data);
  }

  private async syncWorkflowNotifications(recipientId: string): Promise<void> {
    const projects = await this.projectRepository.find({
      where: { clientId: recipientId },
      order: { createdAt: 'DESC' },
    });

    for (const project of projects) {
      await this.createIfMissing({
        type: NotificationType.SUCCESS,
        event: NotificationEvent.PROJECT_CREATED,
        title: `Valuation Job Created - ${project.projectId}`,
        message: `A new valuation job (${project.projectId}) was created for ${project.propertyAddress}.`,
        recipientId,
        recipientRole: 'client',
        projectId: project.id,
      });

      if (project.status === ProjectStatus.SITE_INSPECTED) {
        await this.createIfMissing({
          type: NotificationType.INFO,
          event: NotificationEvent.STAGE_CHANGED,
          title: `Site Inspection Completed - ${project.projectId}`,
          message: `Technical officer has completed site inspection for valuation job ${project.projectId}.`,
          recipientId,
          recipientRole: 'client',
          projectId: project.id,
        });
      }

      if (project.status === ProjectStatus.REPORT_PREPARED) {
        await this.createIfMissing({
          type: NotificationType.SUCCESS,
          event: NotificationEvent.REPORT_PREPARED,
          title: `Report Prepared - ${project.projectId}`,
          message: `Valuation report for job ${project.projectId} has been prepared and is moving through approvals.`,
          recipientId,
          recipientRole: 'client',
          projectId: project.id,
        });
      }

      if (project.status === ProjectStatus.COMPLETED) {
        await this.createIfMissing({
          type: NotificationType.SUCCESS,
          event: NotificationEvent.PROJECT_COMPLETED,
          title: `Project Completed - ${project.projectId}`,
          message: `Valuation job ${project.projectId} has been fully completed.`,
          recipientId,
          recipientRole: 'client',
          projectId: project.id,
        });
      }
    }
  }

  private async syncUnpaidInvoiceReminders(recipientId: string): Promise<void> {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .where('project.clientId = :recipientId', { recipientId })
      .andWhere('invoice.status != :paidStatus', { paidStatus: InvoiceStatus.PAID })
      .orderBy('invoice.createdAt', 'DESC')
      .getMany();

    const nowMs = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (const invoice of invoices) {
      const createdAtMs = new Date(invoice.createdAt).getTime();
      const ageDays = Math.floor((nowMs - createdAtMs) / dayMs);
      const projectId = invoice.project?.projectId || '-';
      const amountText = Number(invoice.amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      if (ageDays >= 7) {
        await this.createIfMissing({
          type: NotificationType.WARNING,
          event: NotificationEvent.PAYMENT_DUE,
          title: `Payment Reminder (7 Days) - ${invoice.invoiceId}`,
          message: `Payment for valuation job ${projectId} is still pending after 7 days. Invoice ${invoice.invoiceId} amount: LKR ${amountText}.`,
          recipientId,
          recipientRole: 'client',
          projectId: invoice.projectId,
        });
      }

      if (ageDays >= 14) {
        await this.createIfMissing({
          type: NotificationType.ERROR,
          event: NotificationEvent.PAYMENT_DUE,
          title: `Payment Warning (14 Days) - ${invoice.invoiceId}`,
          message: `Urgent: payment for valuation job ${projectId} remains unpaid for 14 days. Invoice ${invoice.invoiceId} amount: LKR ${amountText}.`,
          recipientId,
          recipientRole: 'client',
          projectId: invoice.projectId,
        });
      }
    }
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

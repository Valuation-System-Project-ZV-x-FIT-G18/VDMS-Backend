import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { Project } from '../../entities/project.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationEvent, NotificationType } from '../../entities/notification.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createFromL1Approval(input: {
    projectId: string;
    amount: number;
    l1ManagerId?: string;
  }) {
    const normalizedProjectId = (input.projectId || '').trim();
    const parsedAmount = Number(input.amount);

    if (!normalizedProjectId) {
      throw new BadRequestException('projectId is required');
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new BadRequestException('amount must be greater than 0');
    }

    const project = await this.projectRepository.findOne({
      where: [{ id: normalizedProjectId }, { projectId: normalizedProjectId }],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const existingInvoice = await this.invoiceRepository.findOne({
      where: { projectId: project.id },
      order: { createdAt: 'DESC' },
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = existingInvoice
      ? Object.assign(existingInvoice, {
          amount: parsedAmount,
          dueDate,
          status: InvoiceStatus.PENDING,
        })
      : this.invoiceRepository.create({
          invoiceId: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
          projectId: project.id,
          amount: parsedAmount,
          dueDate,
          status: InvoiceStatus.PENDING,
          paymentProofFileName: null,
          paymentProofUploadedAt: null,
          coordinatorNotifiedAt: null,
        });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    await this.notificationsService.create({
      type: NotificationType.INFO,
      event: NotificationEvent.PAYMENT_DUE,
      title: `Payment Invoice Generated - ${project.projectId}`,
      message: `Invoice ${savedInvoice.invoiceId} for valuation job ${project.projectId} is ready. Amount: LKR ${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Due date: ${dueDate.toISOString().slice(0, 10)}.`,
      recipientId: input.l1ManagerId || 'user-l1-manager-001',
      recipientRole: 'l1-manager',
      projectId: project.id,
    });

    return this.findOne(savedInvoice.id);
  }

  async findAll(clientId?: string, search?: string, status?: string) {
    await this.seedIfEmpty();

    const qb = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .orderBy('invoice.createdAt', 'DESC');

    if (clientId) {
      qb.andWhere('project.clientId = :clientId', { clientId });
    }

    if (search) {
      qb.andWhere(
        '(invoice.invoiceId ILIKE :search OR project.projectId ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status && Object.values(InvoiceStatus).includes(status as InvoiceStatus)) {
      qb.andWhere('invoice.status = :status', { status });
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async uploadPaymentProof(id: string, fileName: string) {
    const invoice = await this.findOne(id);

    invoice.paymentProofFileName = fileName;
    invoice.paymentProofUploadedAt = new Date();
    invoice.status = InvoiceStatus.PAID;

    return this.invoiceRepository.save(invoice);
  }

  async removePaymentProof(id: string) {
    const invoice = await this.findOne(id);

    invoice.paymentProofFileName = null;
    invoice.paymentProofUploadedAt = null;

    if (invoice.status === InvoiceStatus.PAID) {
      invoice.status = InvoiceStatus.PENDING;
    }

    return this.invoiceRepository.save(invoice);
  }

  async notifyL1Manager(id: string, l1ManagerId?: string) {
    const invoice = await this.findOne(id);
    invoice.coordinatorNotifiedAt = new Date();
    const savedInvoice = await this.invoiceRepository.save(invoice);

    await this.notificationsService.create({
      type: NotificationType.INFO,
      event: NotificationEvent.PAYMENT_DUE,
      title: `Payment Proof Uploaded - ${savedInvoice.invoiceId}`,
      message: `Payment proof was uploaded for valuation job ${savedInvoice.project?.projectId || '-'}. Invoice amount: LKR ${Number(savedInvoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      recipientId: l1ManagerId || 'user-l1-manager-001',
      recipientRole: 'l1-manager',
      projectId: savedInvoice.projectId,
    });

    return savedInvoice;
  }

  private async seedIfEmpty() {
    const total = await this.invoiceRepository.count();
    if (total > 0) {
      return;
    }

    const projects = await this.projectRepository.find({
      order: { created_at: 'DESC' },
      take: 12,
    });

    if (projects.length === 0) {
      return;
    }

    const now = new Date();

    const seeded = projects.map((project, index) => {
      const dueDate = new Date(now);
      dueDate.setDate(now.getDate() - 3 + index);

      let invoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;
      if (dueDate < now && index % 3 === 0) {
        invoiceStatus = InvoiceStatus.OVERDUE;
      }
      if (index % 5 === 0) {
        invoiceStatus = InvoiceStatus.PAID;
      }

      return this.invoiceRepository.create({
        invoiceId: `INV-${now.getFullYear()}-${String(index + 1).padStart(3, '0')}`,
        projectId: project.id,
        amount: 45000 + index * 5000,
        dueDate,
        status: invoiceStatus,
        paymentProofFileName: invoiceStatus === InvoiceStatus.PAID ? `receipt-${index + 1}.pdf` : null,
        paymentProofUploadedAt: invoiceStatus === InvoiceStatus.PAID ? now : null,
        coordinatorNotifiedAt: null,
      });
    });

    await this.invoiceRepository.save(seeded);
  }
}

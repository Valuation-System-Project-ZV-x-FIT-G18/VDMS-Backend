import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { Project } from '../../entities/project.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(clientId?: string, search?: string, status?: string) {
    await this.seedIfEmpty(clientId);

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

    if (invoice.status === InvoiceStatus.OVERDUE) {
      invoice.status = InvoiceStatus.PENDING;
    }

    return this.invoiceRepository.save(invoice);
  }

  async notifyCoordinator(id: string) {
    const invoice = await this.findOne(id);
    invoice.coordinatorNotifiedAt = new Date();
    return this.invoiceRepository.save(invoice);
  }

  private async seedIfEmpty(clientId?: string) {
    const total = await this.invoiceRepository.count();
    if (total > 0) {
      return;
    }

    const projectWhere = clientId ? { clientId } : {};
    const projects = await this.projectRepository.find({
      where: projectWhere,
      order: { createdAt: 'DESC' },
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

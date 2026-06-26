import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @Query('clientId') clientId?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.invoicesService.findAll(clientId, search, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id/payment-proof')
  uploadPaymentProof(@Param('id') id: string, @Body('fileName') fileName: string) {
    return this.invoicesService.uploadPaymentProof(id, fileName);
  }

  @Patch(':id/payment-proof/remove')
  removePaymentProof(@Param('id') id: string) {
    return this.invoicesService.removePaymentProof(id);
  }

  @Patch(':id/notify')
  notifyL1Manager(@Param('id') id: string, @Query('l1ManagerId') l1ManagerId?: string) {
    return this.invoicesService.notifyL1Manager(id, l1ManagerId);
  }

  @Patch(':id/notify-l1-manager')
  notifyL1ManagerExplicit(@Param('id') id: string, @Query('l1ManagerId') l1ManagerId?: string) {
    return this.invoicesService.notifyL1Manager(id, l1ManagerId);
  }

  @Patch('l1-approval/create')
  createFromL1Approval(
    @Body('projectId') projectId: string,
    @Body('amount') amount: number,
    @Body('l1ManagerId') l1ManagerId?: string,
  ) {
    return this.invoicesService.createFromL1Approval({ projectId, amount, l1ManagerId });
  }
}

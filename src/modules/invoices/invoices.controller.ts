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

  @Patch(':id/notify')
  notifyCoordinator(@Param('id') id: string) {
    return this.invoicesService.notifyCoordinator(id);
  }
}

import { Controller, Get } from '@nestjs/common';
import { FleetService } from './fleet.service';

@Controller('fleet')
export class FleetController {
  constructor(private service: FleetService) {}

  @Get('all-officers')
  async getAllOfficers() {
    return await this.service.getAllOfficers();
  }

  @Get('stats')
  async getStats() {
    return await this.service.getFleetStats();
  }
}

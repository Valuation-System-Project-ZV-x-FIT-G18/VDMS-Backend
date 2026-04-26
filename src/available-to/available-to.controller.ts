import { Controller, Get } from '@nestjs/common'; // NestJS decorators
import { AvailableToService } from './available-to.service';

@Controller('available-to') // GET /available-to
export class AvailableToController {
  constructor(private readonly service: AvailableToService) {}

  @Get()
  findAll() {
    return this.service.findAll(); // returns list of free officers
  }
}

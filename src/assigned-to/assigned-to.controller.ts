import { Controller, Get } from '@nestjs/common'; // NestJS decorators
import { AssignedToService } from './assigned-to.service';

@Controller('assigned-to') // GET /assigned-to
export class AssignedToController {
  constructor(private readonly service: AssignedToService) {}

  @Get()
  findAll() {
    return this.service.findAll(); // returns all assigned officers
  }
}

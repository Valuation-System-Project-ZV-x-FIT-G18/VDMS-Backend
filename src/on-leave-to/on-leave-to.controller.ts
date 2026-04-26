import { Controller, Get } from '@nestjs/common'; // NestJS decorators
import { OnLeaveToService } from './on-leave-to.service';

@Controller('on-leave-to') // GET /on-leave-to
export class OnLeaveToController {
  constructor(private readonly service: OnLeaveToService) {}

  @Get()
  findAll() {
    return this.service.findAll(); // returns all on-leave officers
  }
}

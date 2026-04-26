import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { RejectedToService } from './rejected-to.service';

@Controller('rejected-to') // base route: /rejected-to
export class RejectedToController {
  constructor(private readonly service: RejectedToService) {}

  @Get() // GET /rejected-to — list all
  findAll() {
    return this.service.findAll();
  }

  @Post(':id/accept') // POST /rejected-to/:id/accept
  accept(@Param('id', ParseIntPipe) id: number) {
    return this.service.acceptBack(id); // move officer back to free
  }

  @Post(':id/decline') // POST /rejected-to/:id/decline
  decline(@Param('id', ParseIntPipe) id: number) {
    return this.service.decline(id); // permanently remove
  }
}

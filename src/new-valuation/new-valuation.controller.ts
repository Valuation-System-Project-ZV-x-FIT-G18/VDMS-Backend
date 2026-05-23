import { Controller, Get, Post, Body } from '@nestjs/common'; // NestJS request decorators
import { NewValuationService } from './new-valuation.service';
import { NewValuationDto } from './dto/new-valuation.dto';

@Controller('new-valuation') // base route: /new-valuation
export class NewValuationController {
  constructor(private readonly service: NewValuationService) {}

  @Get('free-officers') // GET /new-valuation/free-officers
  getFreeOfficers() {
    return this.service.getFreeOfficers(); // returns list of available officers
  }

  @Post() // POST /new-valuation — assign officer
  assign(@Body() dto: NewValuationDto) {
    return this.service.assign(dto); // delegate to service for DB write
  }
}

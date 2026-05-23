import { Controller, Post, Body } from '@nestjs/common'; // NestJS decorators
import { LegalDetailsService } from './legal-details.service';
import { LegalDetailsDto } from './dto/legal-details.dto';

@Controller('legal-details') // POST /legal-details
export class LegalDetailsController {
  constructor(private readonly service: LegalDetailsService) {}

  @Post()
  save(@Body() dto: LegalDetailsDto) {
    return this.service.save(dto); // delegate to service
  }
}

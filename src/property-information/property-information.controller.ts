import { Controller, Post, Body } from '@nestjs/common'; // NestJS decorators
import { PropertyInformationService } from './property-information.service';
import { PropertyInformationDto } from './dto/property-information.dto';

@Controller('property-information') // POST /property-information
export class PropertyInformationController {
  constructor(private readonly service: PropertyInformationService) {}

  @Post()
  save(@Body() dto: PropertyInformationDto) {
    return this.service.save(dto); // delegate to service
  }
}

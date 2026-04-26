import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';

@Controller('register') // POST /register
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  register(@Body() dto: RegisterDto) {
    return this.registerService.register(dto); // delegate to service
  }
}

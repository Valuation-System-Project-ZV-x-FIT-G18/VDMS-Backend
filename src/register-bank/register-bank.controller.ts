import { Controller, Post, Body } from '@nestjs/common';
import { RegisterBankService } from './register-bank.service';
import { RegisterBankDto } from './dto/register-bank.dto';

@Controller('register-bank') // POST /register-bank
export class RegisterBankController {
  constructor(private readonly service: RegisterBankService) {}

  @Post()
  register(@Body() dto: RegisterBankDto) {
    return this.service.register(dto); // delegate to service
  }

  @Post('revaluation')
  registerForRevaluation(@Body() dto: RegisterBankDto) {
    return this.service.registerForRevaluation(dto);
  }
}

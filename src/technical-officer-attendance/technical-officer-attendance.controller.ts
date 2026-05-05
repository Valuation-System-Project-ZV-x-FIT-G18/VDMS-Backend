import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CheckInAttendanceDto } from './dto/check-in-attendance.dto';
import { CheckOutAttendanceDto } from './dto/check-out-attendance.dto';
import { TechnicalOfficerAttendanceService } from './technical-officer-attendance.service';

@Controller('technical-officer/attendance')
export class TechnicalOfficerAttendanceController {
  constructor(
    private readonly attendanceService: TechnicalOfficerAttendanceService,
  ) {}

  @Post('check-in')
  checkIn(@Body() checkInDto: CheckInAttendanceDto) {
    return this.attendanceService.checkIn(checkInDto);
  }

  @Patch('check-out')
  checkOut(@Body() checkOutDto: CheckOutAttendanceDto) {
    return this.attendanceService.checkOut(checkOutDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('today')
  findToday(@Query('officerName') officerName?: string) {
    return this.attendanceService.findToday(officerName);
  }
}

import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CheckInAttendanceDto } from './dto/check-in-attendance.dto';
import { CheckOutAttendanceDto } from './dto/check-out-attendance.dto';
import { TechnicalOfficerAttendanceService } from './technical-officer-attendance.service';

// Handles API routes for daily Technical Officer attendance.
@Controller('technical-officer/attendance')
export class TechnicalOfficerAttendanceController {
  constructor(
    private readonly attendanceService: TechnicalOfficerAttendanceService,
  ) {}

  // POST /technical-officer/attendance/check-in - create today's check-in record.
  @Post('check-in')
  checkIn(@Body() checkInDto: CheckInAttendanceDto) {
    return this.attendanceService.checkIn(checkInDto);
  }

  // PATCH /technical-officer/attendance/check-out - update today's record with checkout time.
  @Patch('check-out')
  checkOut(@Body() checkOutDto: CheckOutAttendanceDto) {
    return this.attendanceService.checkOut(checkOutDto);
  }

  // GET /technical-officer/attendance - return attendance history.
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // GET /technical-officer/attendance/today?officerName=John%20Doe - return today's record.
  @Get('today')
  findToday(@Query('officerName') officerName?: string) {
    return this.attendanceService.findToday(officerName);
  }
}

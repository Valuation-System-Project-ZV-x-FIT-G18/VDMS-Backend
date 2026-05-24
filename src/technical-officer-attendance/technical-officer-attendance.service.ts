import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TechnicalOfficerAttendance,
  TechnicalOfficerAttendanceStatus,
} from '../entities/technical-officer-attendance.entity';
import { CheckInAttendanceDto } from './dto/check-in-attendance.dto';
import { CheckOutAttendanceDto } from './dto/check-out-attendance.dto';

@Injectable()
export class TechnicalOfficerAttendanceService {
  constructor(
    @InjectRepository(TechnicalOfficerAttendance)
    private readonly attendanceRepository: Repository<TechnicalOfficerAttendance>,
  ) {}

  async checkIn(checkInDto: CheckInAttendanceDto) {
    const officerName = this.normalizeOfficerName(checkInDto.officerName);
    const now = new Date();
    const today = this.getLocalDateString(now);
    const existingAttendance = await this.findByOfficerAndDate(
      officerName,
      today,
    );

    if (existingAttendance?.checkInTime) {
      throw new ConflictException(
        `${officerName} has already checked in today`,
      );
    }

    const attendance = this.attendanceRepository.create({
      officerName,
      attendanceDate: today,
      checkInTime: now,
      checkOutTime: null,
      totalHours: null,
      status: this.isLateCheckIn(now)
        ? TechnicalOfficerAttendanceStatus.LATE
        : TechnicalOfficerAttendanceStatus.CHECKED_IN,
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(checkOutDto: CheckOutAttendanceDto) {
    const officerName = this.normalizeOfficerName(checkOutDto.officerName);
    const now = new Date();
    const today = this.getLocalDateString(now);
    const attendance = await this.findByOfficerAndDate(officerName, today);

    if (!attendance) {
      throw new NotFoundException(
        `${officerName} has not checked in today`,
      );
    }

    if (!attendance.checkInTime) {
      throw new BadRequestException('Cannot check out before check-in');
    }

    if (attendance.checkOutTime) {
      throw new ConflictException(
        `${officerName} has already checked out today`,
      );
    }

    attendance.checkOutTime = now;
    attendance.totalHours = this.calculateTotalHours(
      attendance.checkInTime,
      now,
    );
    attendance.status = TechnicalOfficerAttendanceStatus.COMPLETED;

    return this.attendanceRepository.save(attendance);
  }

  async findAll() {
    const attendanceRecords = await this.attendanceRepository.find({
      order: { attendanceDate: 'DESC', createdAt: 'DESC' },
    });

    return attendanceRecords.map((attendance) =>
      this.withCalculatedStatus(attendance),
    );
  }

  async findToday(officerName?: string) {
    const today = this.getLocalDateString(new Date());

    if (officerName) {
      const normalizedOfficerName = this.normalizeOfficerName(officerName);
      const attendance = await this.findByOfficerAndDate(
        normalizedOfficerName,
        today,
      );

      return (
        attendance ?? {
          officerName: normalizedOfficerName,
          attendanceDate: today,
          checkInTime: null,
          checkOutTime: null,
          totalHours: null,
          status: TechnicalOfficerAttendanceStatus.NOT_CHECKED_IN,
        }
      );
    }

    return this.attendanceRepository.find({
      where: { attendanceDate: today },
      order: { createdAt: 'DESC' },
    });
  }

  private findByOfficerAndDate(officerName: string, attendanceDate: string) {
    return this.attendanceRepository.findOne({
      where: { officerName, attendanceDate },
    });
  }

  private normalizeOfficerName(officerName: string) {
    const normalizedOfficerName = officerName.trim();

    if (!normalizedOfficerName) {
      throw new BadRequestException('Officer name is required');
    }

    return normalizedOfficerName;
  }

  private calculateTotalHours(checkInTime: Date, checkOutTime: Date) {
    const totalMilliseconds = checkOutTime.getTime() - checkInTime.getTime();
    return Number((totalMilliseconds / (1000 * 60 * 60)).toFixed(2));
  }

  private isLateCheckIn(checkInTime: Date) {
    const lateThreshold = new Date(checkInTime);
    lateThreshold.setHours(9, 15, 0, 0);

    return checkInTime > lateThreshold;
  }

  private getLocalDateString(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private withCalculatedStatus(attendance: TechnicalOfficerAttendance) {
    if (
      !attendance.checkInTime &&
      this.isPastWorkingDay(attendance.attendanceDate)
    ) {
      return {
        ...attendance,
        status: TechnicalOfficerAttendanceStatus.MISSED,
      };
    }

    return attendance;
  }

  private isPastWorkingDay(attendanceDate: string) {
    const today = this.getLocalDateString(new Date());

    if (attendanceDate >= today) {
      return false;
    }

    const date = new Date(`${attendanceDate}T00:00:00`);
    const day = date.getDay();

    return day !== 0 && day !== 6;
  }
}

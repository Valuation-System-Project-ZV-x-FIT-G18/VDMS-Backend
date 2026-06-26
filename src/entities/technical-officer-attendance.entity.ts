import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Allowed attendance statuses shown in the frontend.
export enum TechnicalOfficerAttendanceStatus {
  NOT_CHECKED_IN = 'Not Checked In',
  CHECKED_IN = 'Checked In',
  COMPLETED = 'Completed',
  LATE = 'Late',
  MISSED = 'Missed',
}

// Maps this class to the technical_officer_attendance database table.
@Entity('technical_officer_attendance')
export class TechnicalOfficerAttendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'officer_name' })
  officerName!: string;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate!: string;

  @Column({ name: 'check_in_time', type: 'timestamptz', nullable: true })
  checkInTime!: Date | null;

  @Column({ name: 'check_out_time', type: 'timestamptz', nullable: true })
  checkOutTime!: Date | null;

  @Column({
    name: 'total_hours',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalHours!: number | null;

  @Column({
    default: TechnicalOfficerAttendanceStatus.NOT_CHECKED_IN,
  })
  status!: TechnicalOfficerAttendanceStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

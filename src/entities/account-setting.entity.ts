import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AccountSettingRole {
  BANK_CREDIT_OFFICER = 'bank_credit_officer',
  PROPERTY_OWNER = 'property_owner',
}

@Index(['role', 'accountId'], { unique: true })
@Entity('account_settings')
export class AccountSetting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: AccountSettingRole })
  role!: AccountSettingRole;

  @Column({ name: 'account_id' })
  accountId!: string;

  @Column({ name: 'bank_name', type: 'varchar', nullable: true })
  bankName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  branch!: string | null;

  @Column({ name: 'contact_person_name', type: 'varchar', nullable: true })
  contactPersonName!: string | null;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName!: string | null;

  @Column({ name: 'national_id', type: 'varchar', nullable: true })
  nationalId!: string | null;

  @Column({ name: 'residential_address', type: 'varchar', nullable: true })
  residentialAddress!: string | null;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ name: 'email_notifications', type: 'boolean', default: true })
  emailNotifications!: boolean;

  @Column({ name: 'sms_alerts', type: 'boolean', default: false })
  smsAlerts!: boolean;

  @Column({ name: 'last_password_change_at', type: 'timestamptz', nullable: true })
  lastPasswordChangeAt!: Date | null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: 'last_login_ip', type: 'varchar', nullable: true })
  lastLoginIp!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
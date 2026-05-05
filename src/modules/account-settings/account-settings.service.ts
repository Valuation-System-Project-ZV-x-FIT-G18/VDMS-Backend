import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AccountSetting,
  AccountSettingRole,
} from '../../entities/account-setting.entity';
import { UpdateAccountSettingDto } from './dto/update-account-setting.dto';

@Injectable()
export class AccountSettingsService {
  constructor(
    @InjectRepository(AccountSetting)
    private accountSettingsRepository: Repository<AccountSetting>,
  ) {}

  private assertRole(role: string): AccountSettingRole {
    if (!Object.values(AccountSettingRole).includes(role as AccountSettingRole)) {
      throw new BadRequestException(
        `Unsupported account settings role: ${role}`,
      );
    }

    return role as AccountSettingRole;
  }

  private getDefaultSettings(role: AccountSettingRole, accountId: string) {
    if (role === AccountSettingRole.BANK_CREDIT_OFFICER) {
      return {
        role,
        accountId,
        bankName: 'Commercial Bank PLC',
        branch: 'Colombo 07 - Main Branch',
        contactPersonName: 'David Perera',
        fullName: null,
        nationalId: null,
        residentialAddress: null,
        email: 'david.perera@combank.lk',
        phone: '+94 77 123 4567',
        emailNotifications: true,
        smsAlerts: false,
        lastPasswordChangeAt: new Date('2026-01-26T00:00:00.000Z'),
        lastLoginAt: new Date('2026-04-24T10:42:00.000Z'),
        lastLoginIp: '192.168.1.1',
      };
    }

    return {
      role,
      accountId,
      bankName: null,
      branch: null,
      contactPersonName: null,
      fullName: 'David Silva',
      nationalId: '199012345678',
      residentialAddress: '89 Duplication Rd, Colombo 03',
      email: 'david.silva@gmail.com',
      phone: '+94 77 987 6543',
      emailNotifications: true,
      smsAlerts: false,
      lastPasswordChangeAt: new Date('2026-01-26T00:00:00.000Z'),
      lastLoginAt: new Date('2026-04-24T10:42:00.000Z'),
      lastLoginIp: '192.168.1.1',
    };
  }

  async findOrCreate(roleParam: string, accountId: string) {
    const role = this.assertRole(roleParam);

    let settings = await this.accountSettingsRepository.findOne({
      where: { role, accountId },
    });

    if (!settings) {
      settings = this.accountSettingsRepository.create(
        this.getDefaultSettings(role, accountId),
      );
      settings = await this.accountSettingsRepository.save(settings);
    }

    return settings;
  }

  async update(roleParam: string, accountId: string, dto: UpdateAccountSettingDto) {
    const role = this.assertRole(roleParam);
    const existing = await this.findOrCreate(role, accountId);

    const merged = this.accountSettingsRepository.merge(existing, {
      ...dto,
      lastPasswordChangeAt: dto.lastPasswordChangeAt
        ? new Date(dto.lastPasswordChangeAt)
        : dto.lastPasswordChangeAt === null
          ? null
          : existing.lastPasswordChangeAt,
      lastLoginAt: dto.lastLoginAt
        ? new Date(dto.lastLoginAt)
        : dto.lastLoginAt === null
          ? null
          : existing.lastLoginAt,
    });

    return this.accountSettingsRepository.save(merged);
  }
}
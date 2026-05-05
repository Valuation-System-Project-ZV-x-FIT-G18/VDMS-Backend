import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSetting } from '../../entities/account-setting.entity';
import { AccountSettingsController } from './account-settings.controller';
import { AccountSettingsService } from './account-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountSetting])],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService],
  exports: [AccountSettingsService],
})
export class AccountSettingsModule {}
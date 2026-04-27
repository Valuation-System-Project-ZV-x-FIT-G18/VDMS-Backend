import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AccountSettingsService } from './account-settings.service';
import { UpdateAccountSettingDto } from './dto/update-account-setting.dto';

@Controller('account-settings')
export class AccountSettingsController {
  constructor(private readonly accountSettingsService: AccountSettingsService) {}

  // GET /account-settings/:role/:accountId
  @Get(':role/:accountId')
  findOne(@Param('role') role: string, @Param('accountId') accountId: string) {
    return this.accountSettingsService.findOrCreate(role, accountId);
  }

  // PUT /account-settings/:role/:accountId
  @Put(':role/:accountId')
  update(
    @Param('role') role: string,
    @Param('accountId') accountId: string,
    @Body() dto: UpdateAccountSettingDto,
  ) {
    return this.accountSettingsService.update(role, accountId, dto);
  }
}
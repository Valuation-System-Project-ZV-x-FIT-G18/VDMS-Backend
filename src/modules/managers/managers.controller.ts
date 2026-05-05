import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ManagersService } from './managers.service';

@Controller('managers')
export class ManagersController {
  constructor(private managersService: ManagersService) {}

  @Get()
  findAll(@Query('role') role?: string) {
    return this.managersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.managersService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.managersService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.managersService.delete(id);
  }
}
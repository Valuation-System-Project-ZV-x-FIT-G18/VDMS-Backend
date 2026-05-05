import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BottlenecksService } from './bottlenecks.service';

@Controller('bottlenecks')
export class BottlenecksController {
  constructor(private bottlenecksService: BottlenecksService) {}

  @Get()
  findAll() {
    return this.bottlenecksService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.bottlenecksService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bottlenecksService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.bottlenecksService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.bottlenecksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bottlenecksService.remove(id);
  }
}

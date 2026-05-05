import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTechnicalOfficerProjectDto } from './dto/create-technical-officer-project.dto';
import { UpdateTechnicalOfficerProjectDto } from './dto/update-technical-officer-project.dto';
import { TechnicalOfficerProjectsService } from './technical-officer-projects.service';

@Controller('technical-officer/projects')
export class TechnicalOfficerProjectsController {
  constructor(
    private readonly projectsService: TechnicalOfficerProjectsService,
  ) {}

  @Post()
  create(@Body() createProjectDto: CreateTechnicalOfficerProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateTechnicalOfficerProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}

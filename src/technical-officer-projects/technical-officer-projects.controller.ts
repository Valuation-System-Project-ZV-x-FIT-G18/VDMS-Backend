import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTechnicalOfficerProjectDto } from './dto/create-technical-officer-project.dto';
import { UpdateTechnicalOfficerProjectDto } from './dto/update-technical-officer-project.dto';
import { TechnicalOfficerProjectsService } from './technical-officer-projects.service';

// Handles API routes for Technical Officer project management.
@Controller('technical-officer/projects')
export class TechnicalOfficerProjectsController {
  constructor(
    private readonly projectsService: TechnicalOfficerProjectsService,
  ) {}

  // POST /technical-officer/projects - create a new assigned project.
  @Post()
  create(@Body() createProjectDto: CreateTechnicalOfficerProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  // GET /technical-officer/projects - return all assigned projects.
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET /technical-officer/projects/:id - return one project by id.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  // PATCH /technical-officer/projects/:id - update selected project fields.
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateTechnicalOfficerProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  // DELETE /technical-officer/projects/:id - remove a project.
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}

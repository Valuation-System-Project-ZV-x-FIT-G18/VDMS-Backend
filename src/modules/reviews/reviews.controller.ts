import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, SubmitReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ManagerRole } from '../../entities/manager.entity';
import { ReviewStatus } from '../../entities/review.entity';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(ManagerRole.L3, ManagerRole.L2, ManagerRole.L1)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Get()
  findAll(
    @Query('status') status?: ReviewStatus,
    @Query('projectId') projectId?: string,
    @Query('managerId') managerId?: string,
  ) {
    return this.reviewsService.findAll(managerId, status, projectId);
  }

  @Get('drafts/mine')
  getDraftReviews(@Request() req: any) {
    return this.reviewsService.getDraftReviewsByManager(req.user.id);
  }

  @Get('submitted/mine')
  getSubmittedReviews(@Request() req: any) {
    return this.reviewsService.getSubmittedReviewsByManager(req.user.id);
  }

  @Get('project/:projectId')
  getProjectReviews(@Param('projectId') projectId: string) {
    return this.reviewsService.getProjectReviews(projectId);
  }

  @Get('history/:projectId')
  getReviewHistory(@Param('projectId') projectId: string) {
    return this.reviewsService.getReviewHistory(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Patch(':id/submit')
  @Roles(ManagerRole.L3, ManagerRole.L2, ManagerRole.L1)
  submit(@Param('id') id: string, @Body() submitReviewDto: SubmitReviewDto) {
    return this.reviewsService.submitReview(id, submitReviewDto);
  }

  @Patch(':id/approve')
  @Roles(ManagerRole.L3, ManagerRole.L2, ManagerRole.L1)
  approve(@Param('id') id: string) {
    return this.reviewsService.approveReview(id);
  }

  @Patch(':id/reject')
  @Roles(ManagerRole.L3, ManagerRole.L2, ManagerRole.L1)
  reject(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.reviewsService.rejectReview(id, feedback);
  }

  @Patch(':id/request-revision')
  @Roles(ManagerRole.L3, ManagerRole.L2, ManagerRole.L1)
  requestRevision(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.reviewsService.requestRevision(id, feedback);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}

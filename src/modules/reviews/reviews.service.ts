import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from '../../entities/review.entity';
import { Project } from '../../entities/project.entity';
import { Manager } from '../../entities/manager.entity';
import { CreateReviewDto, UpdateReviewDto, SubmitReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {}

  async create(managerId: string, createReviewDto: CreateReviewDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createReviewDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if this is a revision (parentReviewId provided)
    let version = 1;
    if (createReviewDto.parentReviewId) {
      const parentReview = await this.reviewRepository.findOne({
        where: { id: createReviewDto.parentReviewId },
      });

      if (!parentReview) {
        throw new NotFoundException('Parent review not found');
      }

      version = (parentReview.version || 1) + 1;
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      managerId,
      status: ReviewStatus.DRAFT,
      version,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(managerId?: string, status?: ReviewStatus, projectId?: string) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.project', 'project')
      .leftJoinAndSelect('review.manager', 'manager');

    if (managerId) {
      query.andWhere('review.managerId = :managerId', { managerId });
    }

    if (status) {
      query.andWhere('review.status = :status', { status });
    }

    if (projectId) {
      query.andWhere('review.projectId = :projectId', { projectId });
    }

    query.orderBy('review.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['project', 'manager'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (review.status !== ReviewStatus.DRAFT) {
      throw new BadRequestException('Can only update draft reviews');
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async submitReview(id: string, submitReviewDto: SubmitReviewDto) {
    const review = await this.findOne(id);

    if (review.status !== ReviewStatus.DRAFT) {
      throw new BadRequestException('Can only submit draft reviews');
    }

    review.status = ReviewStatus.SUBMITTED;
    review.submittedAt = new Date();
    if (submitReviewDto.feedback) {
      review.feedback = submitReviewDto.feedback;
    }

    return this.reviewRepository.save(review);
  }

  async approveReview(id: string) {
    const review = await this.findOne(id);

    if (review.status !== ReviewStatus.SUBMITTED && review.status !== ReviewStatus.UNDER_REVIEW) {
      throw new BadRequestException('Can only approve submitted or under-review reviews');
    }

    review.status = ReviewStatus.APPROVED;
    review.approvedAt = new Date();

    return this.reviewRepository.save(review);
  }

  async rejectReview(id: string, feedback: string) {
    if (!feedback) {
      throw new BadRequestException('Feedback is required when rejecting');
    }

    const review = await this.findOne(id);

    review.status = ReviewStatus.REJECTED;
    review.feedback = feedback;

    return this.reviewRepository.save(review);
  }

  async requestRevision(id: string, feedback: string) {
    if (!feedback) {
      throw new BadRequestException('Feedback is required when requesting revision');
    }

    const review = await this.findOne(id);

    review.status = ReviewStatus.REVISION_REQUESTED;
    review.feedback = feedback;

    return this.reviewRepository.save(review);
  }

  async getDraftReviewsByManager(managerId: string) {
    return this.findAll(managerId, ReviewStatus.DRAFT);
  }

  async getSubmittedReviewsByManager(managerId: string) {
    return this.findAll(managerId, ReviewStatus.SUBMITTED);
  }

  async getProjectReviews(projectId: string) {
    return this.findAll(undefined, undefined, projectId);
  }

  async getReviewHistory(projectId: string) {
    // Get all reviews for a project, including revisions
    return this.reviewRepository
      .createQueryBuilder('review')
      .where('review.projectId = :projectId', { projectId })
      .leftJoinAndSelect('review.manager', 'manager')
      .orderBy('review.createdAt', 'DESC')
      .addOrderBy('review.version', 'DESC')
      .getMany();
  }

  async delete(id: string) {
    const review = await this.findOne(id);

    if (review.status !== ReviewStatus.DRAFT) {
      throw new BadRequestException('Can only delete draft reviews');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
}

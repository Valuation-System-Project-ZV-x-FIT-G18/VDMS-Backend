import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Manager, ManagerRole } from './entities/manager.entity';
import { Approval, ApprovalStatus, ApprovalType } from './entities/approval.entity';
import { Review, ReviewStatus } from './entities/review.entity';
import { Project } from './entities/project.entity';
import { seedAllData } from './seeds/seed-all';

@Injectable()
export class SeederService {
  private logger = new Logger('SeederService');

  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  async seed() {
    try {
      this.logger.log('Starting database seed...');
      
      // Check if data already exists
      const projectCount = await this.projectRepository.count();
      const managerCount = await this.managerRepository.count();
      
      if (projectCount === 0 && managerCount === 0) {
        // Run comprehensive seed
        await seedAllData(this.dataSource);
      } else {
        this.logger.log('Data already exists, skipping seed');
      }
    } catch (error) {
      this.logger.error('Seeding failed', error);
      throw error;
    }
  }
}

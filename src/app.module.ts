import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Project } from './entities/project.entity';
import { TeamMember } from './entities/team-member.entity';
import { Approval } from './entities/approval.entity';
import { DraftReport } from './entities/draft-reports.entity';
import { Bottleneck } from './entities/bottleneck.entity';
import { Clarification } from './entities/clarification.entity';
import { SecureShareLink } from './entities/secure-share-link.entity';
import { Notification } from './entities/notification.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ManagersModule } from './modules/managers/managers.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { DraftReportsModule } from './modules/draft-reports/draft-reports.module';
import { TeamMembersModule } from './modules/team-members/team-members.module';
import { BottlenecksModule } from './modules/bottlenecks/bottlenecks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Manager, Project, TeamMember, Approval,
        DraftReport, Bottleneck, Clarification,
        SecureShareLink, Notification
      ],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    ManagersModule,
    ProjectsModule,
    ApprovalsModule,
    DraftReportsModule,
    TeamMembersModule,
    BottlenecksModule,
    NotificationsModule,
    DashboardModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Project, Document, TeamMember, Invoice, Notification],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    ManagersModule,
    ProjectsModule,
    ApprovalsModule,
    DraftReportsModule,
    TeamMembersModule,
    BottlenecksModule,
    NotificationsModule,
  ],
})
export class AppModule {}
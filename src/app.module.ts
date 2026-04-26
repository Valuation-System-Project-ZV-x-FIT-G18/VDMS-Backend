import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectsModule } from './modules/projects/projects.module';
import { Document } from './entities/document.entity';
import { TeamMember } from './entities/team-member.entity';
import { DocumentsModule } from './modules/documents/documents.module';
import { TeamMembersModule } from './modules/team-members/team-members.module';
import { Invoice } from './entities/invoice.entity';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { Notification } from './entities/notification.entity';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { MessagesModule } from './modules/messages/messages.module';
import { AccountSetting } from './entities/account-setting.entity';
import { AccountSettingsModule } from './modules/account-settings/account-settings.module';
import { LoanApplicant } from './entities/loan-applicant.entity';
import { ProjectLoanApplicant } from './entities/project-loan-applicant.entity';
import { ProjectValuation } from './entities/project-valuation.entity';
import { Bank } from './entities/bank.entity';
import { BankOfficer } from './entities/bank-officer.entity';
import { BankProjectOfficer } from './entities/bank-project-officer.entity';
import { Property } from './entities/property.entity';
import { SurveyPlan } from './entities/survey-plan.entity';
import { LegalDetail } from './entities/legal-detail.entity';
import { DocumentUpload } from './entities/document-upload.entity';
import { TechnicalOfficer } from './entities/technical-officer.entity';
import { OnLeave } from './entities/on-leave.entity';
import { AssignedTo } from './entities/assigned-to.entity';
import { FreeOfficer } from './entities/free-officer.entity';
import { Rejected } from './entities/rejected.entity';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { LoanApplicantModule } from './loan-applicant/loan-applicant.module';
import { SearchModule } from './search-client/search.module';
import { RegisterModule } from './register-client/register.module';
import { RegisterBankModule } from './register-bank/register-bank.module';
import { PropertyInformationModule } from './property-information/property-information.module';
import { SurveyPlanModule } from './survey-plan/survey-plan.module';
import { LegalDetailsModule } from './legal-details/legal-details.module';
import { DocumentUploadModule } from './document-upload/document-upload.module';
import { NewValuationModule } from './new-valuation/new-valuation.module';
import { AvailableToModule } from './available-to/available-to.module';
import { OnLeaveToModule } from './on-leave-to/on-leave-to.module';
import { AssignedToModule } from './assigned-to/assigned-to.module';
import { AssignedModule } from './assigned/assigned.module';
import { RejectedToModule } from './rejected-to/rejected-to.module';
import { LayoutModule } from './layout/layout.module';
import { ProjectSummaryModule } from './project-summary/project-summary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Project, Document, TeamMember, Invoice, Notification, ChatConversation, ChatMessage, AccountSetting],
      synchronize: true,
      logging: true,
    }),
    ProjectsModule,
    DocumentsModule,
    TeamMembersModule,
    InvoicesModule,
    NotificationsModule,
    MessagesModule,
    AccountSettingsModule,
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_NAME ?? 'vdms_db',
      entities: [
        User,
        Project,
        LoanApplicant,
        ProjectLoanApplicant,
        ProjectValuation,
        Bank,
        BankOfficer,
        BankProjectOfficer,
        Property,
        SurveyPlan,
        LegalDetail,
        DocumentUpload,
        TechnicalOfficer,
        OnLeave,
        AssignedTo,
        FreeOfficer,
        Rejected,
      ],
      synchronize: false,
    }),
    UserModule,
    ProjectModule,
    LoanApplicantModule,
    SearchModule,
    RegisterModule,
    RegisterBankModule,
    PropertyInformationModule,
    SurveyPlanModule,
    LegalDetailsModule,
    DocumentUploadModule,
    NewValuationModule,
    AvailableToModule,
    OnLeaveToModule,
    AssignedToModule,
    AssignedModule,
    RejectedToModule,
    LayoutModule,
    ProjectSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

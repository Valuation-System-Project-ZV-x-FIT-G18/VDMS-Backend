import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Project, Document, TeamMember, Invoice, Notification, ChatConversation, ChatMessage],
      synchronize: true,
      logging: true,
    }),
    ProjectsModule,
    DocumentsModule,
    TeamMembersModule,
    InvoicesModule,
    NotificationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

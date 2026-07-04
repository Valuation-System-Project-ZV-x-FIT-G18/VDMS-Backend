// Complete seeding script for all tables with frontend mock data
// Run with: npx ts-node seed-complete-data.ts

import { DataSource } from 'typeorm';
import { Manager, ManagerRole } from './src/entities/manager.entity';
import { Approval, ApprovalStatus, ApprovalType } from './src/entities/approval.entity';
import { Review, ReviewStatus } from './src/entities/review.entity';
import { Project, ProjectStatus, PaymentStatus } from './src/entities/project.entity';
import { Document, DocumentStatus } from './src/entities/document.entity';
import { TeamMember, TeamRole } from './src/entities/team-member.entity';
import { Invoice, InvoiceStatus } from './src/entities/invoice.entity';
import {
  Notification,
  NotificationType,
  NotificationEvent,
} from './src/entities/notification.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'vdms_db',
  entities: [Manager, Approval, Review, Project, Document, TeamMember, Invoice, Notification],
  synchronize: false,
  logging: false,
});

async function seedComplete() {
  try {
    await AppDataSource.initialize();
    
    const managerRepo = AppDataSource.getRepository(Manager);
    const projectRepo = AppDataSource.getRepository(Project);
    const approvalRepo = AppDataSource.getRepository(Approval);
    const reviewRepo = AppDataSource.getRepository(Review);
    const teamMemberRepo = AppDataSource.getRepository(TeamMember);
    const documentRepo = AppDataSource.getRepository(Document);
    const invoiceRepo = AppDataSource.getRepository(Invoice);

    console.log('🗑️ Clearing all tables...');
    await approvalRepo.delete({});
    await reviewRepo.delete({});
    await documentRepo.delete({});
    await invoiceRepo.delete({});
    await projectRepo.delete({});
    await teamMemberRepo.delete({});

    // Get existing managers
    const managers = await managerRepo.find();
    const l3Manager = managers.find(m => m.role === ManagerRole.L3);
    const l2Manager = managers.find(m => m.role === ManagerRole.L2);
    const l1Manager = managers.find(m => m.role === ManagerRole.L1);

    // === SEED PROJECTS ===
    console.log('📁 Seeding projects...');
    const projects = [
      {
        projectId: 'PRJ-2026-0001',
        propertyAddress: '4512 Oakwood Drive, Austin, TX',
        applicant: 'John Smith',
        status: ProjectStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        requestedDate: new Date('2023-10-24'),
        expectedCompletion: new Date('2023-10-28'),
        valuation: 450000,
        description: 'Residential property valuation - Single family home',
      },
      {
        projectId: 'PRJ-2026-0002',
        propertyAddress: 'B82 Commercial Plaza, Seattle, WA',
        applicant: 'Sarah Wilson',
        status: ProjectStatus.AWAITING_DOCS,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-23'),
        expectedCompletion: new Date('2023-10-29'),
        valuation: 1250000,
        description: 'Commercial property valuation - Office building',
      },
      {
        projectId: 'PRJ-2026-0003',
        propertyAddress: '1212 Bluebell Way, Denver, CO',
        applicant: 'James Brown',
        status: ProjectStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PAID,
        requestedDate: new Date('2023-10-20'),
        expectedCompletion: new Date('2023-10-24'),
        valuation: 650000,
        description: 'Mixed-use property valuation',
      },
      {
        projectId: 'PRJ-2026-0004',
        propertyAddress: '303 Skyline Apartments, Miami, FL',
        applicant: 'Robert Hall',
        status: ProjectStatus.PAYMENT_PENDING,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-18'),
        expectedCompletion: new Date('2023-10-24'),
        valuation: 2500000,
        description: 'Multi-family residential property valuation',
      },
      {
        projectId: 'PRJ-2026-0005',
        propertyAddress: '19 Larkspur Court, Phoenix, AZ',
        applicant: 'Alice Stevens',
        status: ProjectStatus.REPORT_PREPARED,
        paymentStatus: PaymentStatus.PAID,
        requestedDate: new Date('2023-10-22'),
        expectedCompletion: new Date('2023-10-25'),
        valuation: 425000,
        description: 'Residential property valuation - Vacant land',
      },
      {
        projectId: 'PRJ-2026-0006',
        propertyAddress: '567 Pine Street, Portland, OR',
        applicant: 'Emma Johnson',
        status: ProjectStatus.AWAITING_DOCS,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-25'),
        expectedCompletion: new Date('2023-11-01'),
        valuation: 800000,
        description: 'Retail property valuation',
      },
      {
        projectId: 'PRJ-2026-0007',
        propertyAddress: '891 Maple Avenue, Houston, TX',
        applicant: 'Michael Davis',
        status: ProjectStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        requestedDate: new Date('2023-10-19'),
        expectedCompletion: new Date('2023-10-23'),
        valuation: 550000,
        description: 'Residential property valuation - Single family home',
      },
      {
        projectId: 'PRJ-2026-0008',
        propertyAddress: '234 Cedar Lane, Philadelphia, PA',
        applicant: 'Jennifer Taylor',
        status: ProjectStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PAID,
        requestedDate: new Date('2023-10-21'),
        expectedCompletion: new Date('2023-10-30'),
        valuation: 680000,
        description: 'Commercial property valuation - Retail center',
      },
      {
        projectId: 'PV-RR0221',
        propertyAddress: '4521 Oakwood Avenue, Los Angeles, CA',
        applicant: 'Global Realty Fund',
        status: ProjectStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-24'),
        expectedCompletion: new Date('2023-11-01'),
        valuation: 3200000,
        description: 'Large commercial complex valuation',
      },
      {
        projectId: 'PRJ-2026-0010',
        propertyAddress: '555 Sunset Boulevard, Los Angeles, CA',
        applicant: 'Premier Properties Inc.',
        status: ProjectStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-20'),
        expectedCompletion: new Date('2023-10-28'),
        valuation: 2800000,
        description: 'High-end residential property valuation',
      },
      {
        projectId: 'PRJ-2026-0011',
        propertyAddress: '777 Mountain View Road, Denver, CO',
        applicant: 'Colorado Real Estate Group',
        status: ProjectStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PENDING,
        requestedDate: new Date('2023-10-22'),
        expectedCompletion: new Date('2023-10-30'),
        valuation: 1950000,
        description: 'Mountain property valuation',
      },
    ];

    const savedProjects: any[] = [];
    for (const project of projects) {
      const projectData = {
        ...project,
        requestedDate: project.requestedDate instanceof Date ? project.requestedDate.toISOString() : project.requestedDate,
        expectedCompletion: project.expectedCompletion instanceof Date ? project.expectedCompletion.toISOString() : project.expectedCompletion,
      };
      const newProject = projectRepo.create(projectData);
      const saved = await projectRepo.save(newProject);
      savedProjects.push(saved);
      console.log(`✅ Created project: ${project.projectId}`);
    }

    // === SEED TEAM MEMBERS ===
    console.log('👥 Seeding team members...');
    const teamMembers = [
      { name: 'Alice Stevens', role: TeamRole.TECHNICAL_OFFICER, email: 'alice.stevens@vdms.com' },
      { name: 'Mark Kendrick', role: TeamRole.TECHNICAL_OFFICER, email: 'mark.kendrick@vdms.com' },
      { name: 'Sarah Lee', role: TeamRole.TECHNICAL_OFFICER, email: 'sarah.lee@vdms.com' },
      { name: 'David Chen', role: TeamRole.TECHNICAL_OFFICER, email: 'david.chen@vdms.com' },
      { name: 'Jessica Martinez', role: TeamRole.TECHNICAL_OFFICER, email: 'jessica.martinez@vdms.com' },
      { name: 'Christopher Lee', role: TeamRole.TECHNICAL_OFFICER, email: 'christopher.lee@vdms.com' },
      { name: 'Mike Johnson', role: TeamRole.COORDINATOR, email: 'mike.johnson@vdms.com' },
      { name: 'Emma Davis', role: TeamRole.COORDINATOR, email: 'emma.davis@vdms.com' },
      { name: 'Sophie Turner', role: TeamRole.COORDINATOR, email: 'sophie.turner@vdms.com' },
      { name: 'John Davis', role: TeamRole.COORDINATOR, email: 'john.davis@vdms.com' },
      { name: 'Lisa Anderson', role: TeamRole.COORDINATOR, email: 'lisa.anderson@vdms.com' },
      { name: 'Rachel Green', role: TeamRole.COORDINATOR, email: 'rachel.green@vdms.com' },
      { name: 'Tom Brown', role: TeamRole.COORDINATOR, email: 'tom.brown@vdms.com' },
      { name: 'Daniel Wilson', role: TeamRole.COORDINATOR, email: 'daniel.wilson@vdms.com' },
    ];

    const savedTeamMembers: any[] = [];
    for (const member of teamMembers) {
      const newMember = teamMemberRepo.create(member);
      const saved = await teamMemberRepo.save(newMember);
      savedTeamMembers.push(saved);
      console.log(`✅ Created team member: ${member.name} (${member.role})`);
    }

    // === SEED APPROVALS ===
    console.log('✅ Seeding approvals...');
    const approvalData = [
      {
        projectId: savedProjects[1].id, // PRJ-2026-0002
        managerId: l3Manager?.id,
        approvalType: ApprovalType.REPORT_APPROVAL,
        status: ApprovalStatus.PENDING,
        comments: 'Awaiting initial review',
      },
      {
        projectId: savedProjects[5].id, // PRJ-2026-0006
        managerId: l3Manager?.id,
        approvalType: ApprovalType.DOCUMENT_REVIEW,
        status: ApprovalStatus.PENDING,
        comments: 'Document review required',
      },
      {
        projectId: savedProjects[3].id, // PRJ-2026-0004
        managerId: l2Manager?.id,
        approvalType: ApprovalType.PAYMENT_AUTHORIZATION,
        status: ApprovalStatus.PENDING,
        comments: 'Payment authorization pending',
      },
      {
        projectId: savedProjects[7].id, // PRJ-2026-0008
        managerId: l2Manager?.id,
        approvalType: ApprovalType.DOCUMENT_REVIEW,
        status: ApprovalStatus.APPROVED,
        comments: 'All documents verified',
      },
      {
        projectId: savedProjects[0].id, // PRJ-2026-0001
        managerId: l1Manager?.id,
        approvalType: ApprovalType.REPORT_APPROVAL,
        status: ApprovalStatus.APPROVED,
        comments: 'Final approval granted',
      },
      {
        projectId: savedProjects[6].id, // PRJ-2026-0007
        managerId: l1Manager?.id,
        approvalType: ApprovalType.PAYMENT_AUTHORIZATION,
        status: ApprovalStatus.APPROVED,
        comments: 'Payment approved and processed',
      },
    ];

    for (const approval of approvalData) {
      if (approval.managerId) {
        const newApproval = approvalRepo.create(approval);
        await approvalRepo.save(newApproval);
        console.log(`✅ Created approval for project: ${approval.projectId}`);
      }
    }

    // === SEED REVIEWS ===
    console.log('📝 Seeding reviews...');
    const reviewData = [
      {
        projectId: savedProjects[1].id, // PRJ-2026-0002
        managerId: l3Manager?.id,
        title: 'Commercial Plaza Valuation Review',
        content: 'Property inspection completed. Commercial building in prime location shows strong valuation metrics. Comparable sales analysis confirms market value of $1,250,000.',
        status: ReviewStatus.SUBMITTED,
        version: 1,
        feedback: '',
      },
      {
        projectId: savedProjects[0].id, // PRJ-2026-0001
        managerId: l3Manager?.id,
        title: 'Oakwood Drive Residential Appraisal',
        content: 'Single family residential property. Condition: Good. Lot size: 0.5 acres. Final valuation: $450,000 based on recent comps.',
        status: ReviewStatus.APPROVED,
        version: 1,
        feedback: 'Approved by L1 manager',
      },
      {
        projectId: savedProjects[2].id, // PRJ-2026-0003
        managerId: l2Manager?.id,
        title: 'Bluebell Way Mixed-Use Property',
        content: 'Mixed-use property with residential and commercial components. Valuation completed using dual approach. Total value: $650,000.',
        status: ReviewStatus.DRAFT,
        version: 1,
        feedback: '',
      },
      {
        projectId: savedProjects[3].id, // PRJ-2026-0004
        managerId: l2Manager?.id,
        title: 'Skyline Apartments Complex Review',
        content: 'Multi-family residential complex with 45 units. Property condition excellent. Valuation based on income approach: $2,500,000.',
        status: ReviewStatus.SUBMITTED,
        version: 1,
        feedback: '',
      },
      {
        projectId: savedProjects[4].id, // PRJ-2026-0005
        managerId: l1Manager?.id,
        title: 'Larkspur Court Vacant Land Assessment',
        content: 'Vacant land parcel in residential area. Zoned for single-family development. Site conditions suitable for development. Valuation: $425,000.',
        status: ReviewStatus.APPROVED,
        version: 1,
        feedback: 'Approved - ready for development',
      },
    ];

    for (const review of reviewData) {
      if (review.managerId) {
        const newReview = reviewRepo.create(review);
        await reviewRepo.save(newReview);
        console.log(`✅ Created review for project: ${review.projectId}`);
      }
    }

    // === SEED DOCUMENTS ===
    console.log('📄 Seeding documents...');
    for (let i = 0; i < savedProjects.length; i++) {
      const docTypes = ['Appraisal Report', 'Site Inspection', 'Title Report', 'Photos', 'Comparable Sales'];
      for (const docType of docTypes) {
        const newDocument = documentRepo.create({
          projectId: savedProjects[i].id,
          name: `${docType} - ${savedProjects[i].projectId}`,
          status: DocumentStatus.APPROVED,
          uploadedBy: 'System',
          fileUrl: `/documents/${savedProjects[i].projectId}/${docType.replace(/ /g, '-')}.pdf`,
          required: true,
        });
        await documentRepo.save(newDocument);
      }
      console.log(`✅ Created documents for: ${savedProjects[i].projectId}`);
    }

    // === SEED INVOICES ===
    console.log('💰 Seeding invoices...');
    const invoiceData = [
      {
        projectId: savedProjects[0].id, // PRJ-2026-0001
        amount: 4500,
        status: InvoiceStatus.PAID,
        dueDate: new Date('2023-11-10'),
      },
      {
        projectId: savedProjects[1].id, // PRJ-2026-0002
        amount: 6250,
        status: InvoiceStatus.PENDING,
        dueDate: new Date('2023-11-15'),
      },
      {
        projectId: savedProjects[2].id, // PRJ-2026-0003
        amount: 5200,
        status: InvoiceStatus.PAID,
        dueDate: new Date('2023-11-05'),
      },
      {
        projectId: savedProjects[3].id, // PRJ-2026-0004
        amount: 8500,
        status: InvoiceStatus.PENDING,
        dueDate: new Date('2023-11-20'),
      },
      {
        projectId: savedProjects[4].id, // PRJ-2026-0005
        amount: 4250,
        status: InvoiceStatus.PAID,
        dueDate: new Date('2023-10-30'),
      },
      {
        projectId: savedProjects[5].id, // PRJ-2026-0006
        amount: 5600,
        status: InvoiceStatus.PENDING,
        dueDate: new Date('2023-11-12'),
      },
    ];

    for (const inv of invoiceData) {
      const newInvoice = invoiceRepo.create(inv);
      await invoiceRepo.save(newInvoice);
      console.log(`✅ Created invoice for project: ${inv.projectId}`);
    }

    // === SEED NOTIFICATIONS ===
    console.log('🔔 Seeding notifications...');
    const notifications = [
      {
        recipientId: l3Manager?.id,
        recipientRole: 'l3-manager',
        type: NotificationType.WARNING,
        event: NotificationEvent.STAGE_CHANGED,
        title: 'New approval required',
        message: 'New approval required',
        isRead: false,
      },
      {
        recipientId: l3Manager?.id,
        recipientRole: 'l3-manager',
        type: NotificationType.INFO,
        event: NotificationEvent.DOCUMENT_MISSING,
        title: 'New document received',
        message: 'New document received for PRJ-2026-0006',
        isRead: false,
      },
      {
        recipientId: l2Manager?.id,
        recipientRole: 'l2-manager',
        type: NotificationType.SUCCESS,
        event: NotificationEvent.REPORT_PREPARED,
        title: 'Review ready for approval',
        message: 'PRJ-2026-0004 review is ready for approval',
        isRead: false,
      },
      {
        recipientId: l1Manager?.id,
        recipientRole: 'l1-manager',
        type: NotificationType.INFO,
        event: NotificationEvent.PAYMENT_DUE,
        title: 'Payment verified',
        message: 'PRJ-2026-0001 payment has been verified',
        isRead: true,
      },
    ];

    for (const notif of notifications) {
      if (notif.recipientId) {
        const newNotification = AppDataSource.getRepository(Notification).create(notif);
        await AppDataSource.getRepository(Notification).save(newNotification);
      }
    }
    console.log('✅ Created notifications');

    console.log('\n✅ All data seeded successfully!');
    console.log(`
📊 Summary:
  - Projects: ${savedProjects.length}
  - Team Members: ${savedTeamMembers.length}
  - Approvals: ${approvalData.length}
  - Reviews: ${reviewData.length}
  - Documents: ${savedProjects.length * 5}
  - Invoices: ${invoiceData.length}
  - Notifications: ${notifications.length}
    `);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

seedComplete();

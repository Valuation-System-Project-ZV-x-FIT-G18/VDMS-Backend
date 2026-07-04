import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Manager, ManagerRole } from '../entities/manager.entity';
import { Project, ProjectStatus, PaymentStatus } from '../entities/project.entity';
import { TeamMember, TeamRole } from '../entities/team-member.entity';
import { Approval, ApprovalStatus, ApprovalType } from '../entities/approval.entity';
import { Review, ReviewStatus } from '../entities/review.entity';
import { mockProjects as mockProjectsData, teamMembers as mockTeamMembersData, pendingApprovals as pendingApprovalsData } from './mockDataComplete';

// Mock Reviews Data (not in mockDataComplete yet)
const mockReviewsData = [
  {
    projectId: 'PRJ-2026-0001',
    propertyAddress: '4512 Oakwood Drive, Austin, TX',
    applicant: 'John Smith',
    status: 'Completed',
    requestedDate: '2023-10-24',
    expectedCompletion: '2023-10-28',
    paymentStatus: 'Paid',
  },
  {
    projectId: 'PRJ-2026-0002',
    propertyAddress: 'B82 Commercial Plaza, Seattle, WA',
    applicant: 'Sarah Wilson',
    status: 'Needs Review',
    requestedDate: '2023-10-23',
    expectedCompletion: '2023-10-29',
    paymentStatus: 'Pending',
  },
  {
    projectId: 'PRJ-2026-0003',
    propertyAddress: '1212 Bluebell Way, Denver, CO',
    applicant: 'James Brown',
    status: 'In Progress',
    requestedDate: '2023-10-20',
    expectedCompletion: '2023-10-24',
    paymentStatus: 'Paid',
  },
  {
    projectId: 'PRJ-2026-0004',
    propertyAddress: '303 Skyline Apartments, Miami, FL',
    applicant: 'Robert Hall',
    status: 'Payment Pending',
    requestedDate: '2023-10-18',
    expectedCompletion: '2023-10-24',
    paymentStatus: 'Pending',
  },
  {
    projectId: 'PRJ-2026-0005',
    propertyAddress: '19 Larkspur Court, Phoenix, AZ',
    applicant: 'Alice Stevens',
    status: 'Report Prepared',
    requestedDate: '2023-10-22',
    expectedCompletion: '2023-10-25',
    paymentStatus: 'Paid',
  },
  {
    projectId: 'PRJ-2026-0006',
    propertyAddress: '567 Pine Street, Portland, OR',
    applicant: 'Emma Johnson',
    status: 'Needs Review',
    requestedDate: '2023-10-25',
    expectedCompletion: '2023-11-01',
    paymentStatus: 'Pending',
  },
  {
    projectId: 'PRJ-2026-0007',
    propertyAddress: '891 Maple Avenue, Houston, TX',
    applicant: 'Michael Davis',
    status: 'Completed',
    requestedDate: '2023-10-19',
    expectedCompletion: '2023-10-23',
    paymentStatus: 'Paid',
  },
  {
    projectId: 'PRJ-2026-0008',
    propertyAddress: '234 Cedar Lane, Philadelphia, PA',
    applicant: 'Jennifer Taylor',
    status: 'In Progress',
    requestedDate: '2023-10-21',
    expectedCompletion: '2023-10-30',
    paymentStatus: 'Paid',
  },
  {
    projectId: 'PV-RR0221',
    propertyAddress: '4521 Oakwood Avenue, Los Angeles, CA',
    applicant: 'Global Realty Fund',
    status: 'Rejected',
    requestedDate: '2023-10-24',
    expectedCompletion: '2023-11-01',
    paymentStatus: 'Pending',
  },
  {
    projectId: 'PRJ-2026-0010',
    propertyAddress: '555 Sunset Boulevard, Los Angeles, CA',
    applicant: 'Premier Properties Inc.',
    status: 'Rejected',
    requestedDate: '2023-10-20',
    expectedCompletion: '2023-10-28',
    paymentStatus: 'Pending',
  },
  {
    projectId: 'PRJ-2026-0001',
    title: 'Property Valuation Review',
    content:
      'This is a thorough review of the property valuation. All documents are in order and the inspection has been completed successfully. The property meets all requirements for approval.',
    status: 'Approved',
  },
  {
    projectId: 'PRJ-2026-0002',
    title: 'Document Verification Review',
    content:
      'Review of submitted documents for project at B82 Commercial Plaza. Some minor discrepancies noted but overall acceptable.',
    status: 'Under Review',
  },
  {
    projectId: 'PRJ-2026-0003',
    title: 'Technical Assessment',
    content:
      'Technical officer assessment of property condition. All structural elements checked and found to be satisfactory.',
    status: 'Submitted',
  },
];

// Map status strings to enums
const statusMap: { [key: string]: ProjectStatus } = {
  'Completed': ProjectStatus.COMPLETED,
  'Needs Review': ProjectStatus.REPORT_PREPARED,
  'In Progress': ProjectStatus.IN_PROGRESS,
  'Payment Pending': ProjectStatus.PAYMENT_PENDING,
  'Report Prepared': ProjectStatus.REPORT_PREPARED,
  'Rejected': ProjectStatus.IN_PROGRESS,
  'Site Inspected': ProjectStatus.SITE_INSPECTED,
  'Awaiting Docs': ProjectStatus.AWAITING_DOCS,
};

const paymentStatusMap: { [key: string]: PaymentStatus } = {
  'Paid': PaymentStatus.PAID,
  'Pending': PaymentStatus.PENDING,
};

const teamRoleMap: { [key: string]: TeamRole } = {
  'technical_officer': TeamRole.TECHNICAL_OFFICER,
  'coordinator': TeamRole.COORDINATOR,
};

const approvalTypeMap: { [key: string]: ApprovalType } = {
  'Document Review': ApprovalType.DOCUMENT_REVIEW,
  'Report Approval': ApprovalType.REPORT_APPROVAL,
  'Payment Authorization': ApprovalType.PAYMENT_AUTHORIZATION,
  'Project Completion': ApprovalType.PROJECT_COMPLETION,
};

const reviewStatusMap: { [key: string]: ReviewStatus } = {
  'Draft': ReviewStatus.DRAFT,
  'Submitted': ReviewStatus.SUBMITTED,
  'Under Review': ReviewStatus.UNDER_REVIEW,
  'Approved': ReviewStatus.APPROVED,
  'Rejected': ReviewStatus.REJECTED,
};

export async function seedAllData(dataSource: DataSource) {
  console.log('🌱 Starting comprehensive database seed...');

  const managerRepository = dataSource.getRepository(Manager);
  const projectRepository = dataSource.getRepository(Project);
  const teamMemberRepository = dataSource.getRepository(TeamMember);
  const approvalRepository = dataSource.getRepository(Approval);
  const reviewRepository = dataSource.getRepository(Review);

  try {
    // 1. SEED MANAGERS (L1, L2, L3)
    console.log('\n📋 Step 1: Seeding Managers...');
    const existingManagers = await managerRepository.count();
    if (existingManagers > 0) {
      console.log('✓ Managers already exist, skipping...');
    } else {
      const managers = [
        {
          name: 'MD Director - John Thompson',
          email: 'l1.manager@vdms.com',
          password: 'L1Manager@2026', // Will be hashed
          role: ManagerRole.L1,
          phone: '+1-555-0101',
        },
        {
          name: 'AGM Officer - Rachel Park',
          email: 'l2.manager@vdms.com',
          password: 'L2Manager@2026',
          role: ManagerRole.L2,
          phone: '+1-555-0102',
        },
        {
          name: 'Senior Valuator - Michael Chen',
          email: 'l3.manager@vdms.com',
          password: 'L3Manager@2026',
          role: ManagerRole.L3,
          phone: '+1-555-0103',
        },
      ];

      for (const managerData of managers) {
        const hashedPassword = await bcrypt.hash(managerData.password, 10);
        const manager = managerRepository.create({
          ...managerData,
          password: hashedPassword,
        });
        await managerRepository.save(manager);
        console.log(`✓ Created manager: ${managerData.email} (${managerData.role})`);
      }
    }

    // 2. SEED PROJECTS
    console.log('\n📦 Step 2: Seeding Projects...');
    const existingProjects = await projectRepository.count();
    if (existingProjects > 0) {
      console.log('✓ Projects already exist, skipping...');
    } else {
      const projects: Project[] = [];
      for (const projectData of mockProjectsData) {
        const project = projectRepository.create({
          projectId: projectData.projectId,
          propertyAddress: projectData.propertyAddress,
          applicant: projectData.applicant,
          status: statusMap[projectData.status] || ProjectStatus.IN_PROGRESS,
          requestedDate: new Date(projectData.requestedDate).toISOString(),
          expectedCompletion: new Date(projectData.expectedCompletion).toISOString(),
          paymentStatus: paymentStatusMap[projectData.paymentStatus] || PaymentStatus.PENDING,
          // clientId is required (NOT NULL). No client/user is seeded in this portal,
          // so all demo projects are owned by a single placeholder client. 'client-001'
          // matches the example recipientId used by the notifications endpoint.
          clientId: 'client-001',
        } as any);
        const savedProject: Project = await projectRepository.save(project) as unknown as Project;
        projects.push(savedProject);
        console.log(`✓ Created project: ${projectData.projectId}`);
      }

      // 3. SEED TEAM MEMBERS (assigned to first project)
      console.log('\n👥 Step 3: Seeding Team Members...');
      for (let i = 0; i < mockTeamMembersData.length; i++) {
        const teamMemberData = mockTeamMembersData[i] as {
          name: string;
          role: string;
          email?: string;
          phone?: string;
        };
        // email is required (NOT NULL); projectId is required and ties the member to a
        // project. Distribute members round-robin across the seeded projects.
        const teamMember = teamMemberRepository.create({
          name: teamMemberData.name,
          role: teamRoleMap[teamMemberData.role] || TeamRole.TECHNICAL_OFFICER,
          email:
            teamMemberData.email ||
            `${teamMemberData.name.toLowerCase().replace(/\s+/g, '.')}@vdms.com`,
          phone: teamMemberData.phone ?? null,
          projectId: projects[i % projects.length].id,
        } as any);
        await teamMemberRepository.save(teamMember);
        console.log(`✓ Created team member: ${teamMemberData.name} (${teamMemberData.role})`);
      }

      // 4. SEED APPROVALS
      console.log('\n✅ Step 4: Seeding Approvals...');
      const managers = await managerRepository.find();
      const l3Manager = managers.find((m) => m.role === ManagerRole.L3);

      if (!l3Manager) {
        console.warn('⚠️ No L3 manager found, skipping approvals...');
      } else {
        for (const approvalData of pendingApprovalsData) {
          // Find project by projectId
          const project = projects.find((p) => p.projectId === approvalData.projectId);
          if (project) {
            const approval = approvalRepository.create({
              projectId: project.id,
              managerId: l3Manager.id,
              approvalType: approvalTypeMap[approvalData.approvalType] || ApprovalType.DOCUMENT_REVIEW,
              status: ApprovalStatus.PENDING,
              priority: approvalData.priority,
              comments: `Approval pending for ${project.projectId}`,
            });
            await approvalRepository.save(approval);
            console.log(`✓ Created approval for: ${approvalData.projectId}`);
          }
        }
      }

      // 5. SEED REVIEWS
      console.log('\n📝 Step 5: Seeding Reviews...');
      for (const reviewData of mockReviewsData) {
        const project = projects.find((p) => p.projectId === reviewData.projectId);
        // mockReviewsData mixes in project-shaped rows that have no title/content;
        // only seed entries that are actually reviews.
        if (project && l3Manager && reviewData.title && reviewData.content) {
          const review = reviewRepository.create({
            projectId: project.id,
            managerId: l3Manager.id,
            title: reviewData.title,
            content: reviewData.content,
            status: reviewStatusMap[reviewData.status] || ReviewStatus.DRAFT,
            version: 1,
            feedback: `Initial review for ${project.projectId}`,
          });
          await reviewRepository.save(review);
          console.log(`✓ Created review for: ${reviewData.projectId}`);
        }
      }

      console.log('\n✨ Database seed completed successfully!');
      console.log(`
📊 Seed Summary:
  - ${managers.length} Managers seeded
  - ${projects.length} Projects seeded
  - ${mockTeamMembersData.length} Team Members seeded
  - ${pendingApprovalsData.length} Approvals seeded
  - ${mockReviewsData.length} Reviews seeded
      `);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

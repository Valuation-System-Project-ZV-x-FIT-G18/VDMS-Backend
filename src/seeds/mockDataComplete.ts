/**
 * VDMS Complete Mock Data File for L1, L2, L3 Managers
 * Source: Frontend mock data files from L1, L2, and L3 feature folders
 * Combined into unified export
 */

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export const dashboardStats = {
  totalProjects: 156,
  reviewPending: 24,
  approvedProjects: 98,
  rejectedProjects: 8,
  totalRevenue: 2450000,
  pendingApprovals: 12,
  completionRate: 88,
};

// ============================================================================
// PROJECTS (11 Total)
// ============================================================================

export const mockProjects = [
  {
    id: '1',
    projectId: 'PRJ-2026-0001',
    propertyAddress: '4512 Oakwood Drive, Austin, TX',
    applicant: 'John Smith',
    status: 'Completed',
    requestedDate: '2023-10-24',
    expectedCompletion: '2023-10-28',
    paymentStatus: 'Paid',
    technicalOfficer: 'Alice Stevens',
    coordinator: 'Mike Johnson',
  },
  {
    id: '2',
    projectId: 'PRJ-2026-0002',
    propertyAddress: 'B82 Commercial Plaza, Seattle, WA',
    applicant: 'Sarah Wilson',
    status: 'Needs Review',
    requestedDate: '2023-10-23',
    expectedCompletion: '2023-10-29',
    paymentStatus: 'Pending',
    technicalOfficer: 'Mark Kendrick',
    coordinator: 'Emma Davis',
  },
  {
    id: '3',
    projectId: 'PRJ-2026-0003',
    propertyAddress: '1212 Bluebell Way, Denver, CO',
    applicant: 'James Brown',
    status: 'In Progress',
    requestedDate: '2023-10-20',
    expectedCompletion: '2023-10-24',
    paymentStatus: 'Paid',
    technicalOfficer: 'Sarah Lee',
    coordinator: 'Daniel Wilson',
  },
  {
    id: '4',
    projectId: 'PRJ-2026-0004',
    propertyAddress: '303 Skyline Apartments, Miami, FL',
    applicant: 'Robert Hall',
    status: 'Payment Pending',
    requestedDate: '2023-10-18',
    expectedCompletion: '2023-10-24',
    paymentStatus: 'Pending',
    technicalOfficer: 'Robert Hall',
    coordinator: 'Lisa Anderson',
  },
  {
    id: '5',
    projectId: 'PRJ-2026-0005',
    propertyAddress: '19 Larkspur Court, Phoenix, AZ',
    applicant: 'Alice Stevens',
    status: 'Report Prepared',
    requestedDate: '2023-10-22',
    expectedCompletion: '2023-10-25',
    paymentStatus: 'Paid',
    technicalOfficer: 'Alice Stevens',
    coordinator: 'John Davis',
  },
  {
    id: '6',
    projectId: 'PRJ-2026-0006',
    propertyAddress: '567 Pine Street, Portland, OR',
    applicant: 'Emma Johnson',
    status: 'Needs Review',
    requestedDate: '2023-10-25',
    expectedCompletion: '2023-11-01',
    paymentStatus: 'Pending',
    technicalOfficer: 'David Chen',
    coordinator: 'Sophie Turner',
  },
  {
    id: '7',
    projectId: 'PRJ-2026-0007',
    propertyAddress: '891 Maple Avenue, Houston, TX',
    applicant: 'Michael Davis',
    status: 'Completed',
    requestedDate: '2023-10-19',
    expectedCompletion: '2023-10-23',
    paymentStatus: 'Paid',
    technicalOfficer: 'Jessica Martinez',
    coordinator: 'Tom Brown',
  },
  {
    id: '8',
    projectId: 'PRJ-2026-0008',
    propertyAddress: '234 Cedar Lane, Philadelphia, PA',
    applicant: 'Jennifer Taylor',
    status: 'In Progress',
    requestedDate: '2023-10-21',
    expectedCompletion: '2023-10-30',
    paymentStatus: 'Paid',
    technicalOfficer: 'Christopher Lee',
    coordinator: 'Rachel Green',
  },
  {
    id: '9',
    projectId: 'PV-RR0221',
    propertyAddress: '4521 Oakwood Avenue, Los Angeles, CA',
    applicant: 'Global Realty Fund',
    status: 'Rejected',
    requestedDate: '2023-10-24',
    expectedCompletion: '2023-11-01',
    paymentStatus: 'Pending',
    technicalOfficer: 'Mark Kendrick',
    coordinator: 'Sophie Turner',
  },
  {
    id: '10',
    projectId: 'PRJ-2026-0010',
    propertyAddress: '555 Sunset Boulevard, Los Angeles, CA',
    applicant: 'Premier Properties Inc.',
    status: 'Rejected',
    requestedDate: '2023-10-20',
    expectedCompletion: '2023-10-28',
    paymentStatus: 'Pending',
    technicalOfficer: 'Alice Stevens',
    coordinator: 'John Davis',
  },
  {
    id: '11',
    projectId: 'PRJ-2026-0011',
    propertyAddress: '777 Mountain View Road, Denver, CO',
    applicant: 'Colorado Real Estate Group',
    status: 'Rejected',
    requestedDate: '2023-10-22',
    expectedCompletion: '2023-10-30',
    paymentStatus: 'Pending',
    technicalOfficer: 'David Chen',
    coordinator: 'Emma Davis',
  },
];

// ============================================================================
// TEAM MEMBERS (8 Total)
// ============================================================================

export const teamMembers = [
  {
    id: '1',
    name: 'Alice Stevens',
    role: 'technical_officer',
    email: 'alice.stevens@vdms.com',
    phone: '+1-555-0201',
    activeProjects: 8,
    completedProjects: 28,
    workload: 'Medium',
  },
  {
    id: '2',
    name: 'Mark Kendrick',
    role: 'technical_officer',
    email: 'mark.kendrick@vdms.com',
    phone: '+1-555-0202',
    activeProjects: 6,
    completedProjects: 31,
    workload: 'Low',
  },
  {
    id: '3',
    name: 'Sarah Lee',
    role: 'technical_officer',
    email: 'sarah.lee@vdms.com',
    phone: '+1-555-0203',
    activeProjects: 10,
    completedProjects: 25,
    workload: 'High',
  },
  {
    id: '4',
    name: 'David Chen',
    role: 'technical_officer',
    email: 'david.chen@vdms.com',
    phone: '+1-555-0204',
    activeProjects: 7,
    completedProjects: 29,
    workload: 'Medium',
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    role: 'technical_officer',
    email: 'jessica.martinez@vdms.com',
    phone: '+1-555-0205',
    activeProjects: 5,
    completedProjects: 35,
    workload: 'Low',
  },
  {
    id: '6',
    name: 'Mike Johnson',
    role: 'coordinator',
    email: 'mike.johnson@vdms.com',
    phone: '+1-555-0206',
    activeProjects: 12,
    completedProjects: 42,
    workload: 'High',
  },
  {
    id: '7',
    name: 'Emma Davis',
    role: 'coordinator',
    email: 'emma.davis@vdms.com',
    phone: '+1-555-0207',
    activeProjects: 9,
    completedProjects: 38,
    workload: 'Medium',
  },
  {
    id: '8',
    name: 'Sophie Turner',
    role: 'coordinator',
    email: 'sophie.turner@vdms.com',
    phone: '+1-555-0208',
    activeProjects: 11,
    completedProjects: 40,
    workload: 'High',
  },
];

// ============================================================================
// PENDING APPROVALS (6 Total)
// ============================================================================

export const pendingApprovals = [
  {
    projectId: 'PRJ-2026-0002',
    propertyAddress: 'B82 Commercial Plaza, Seattle, WA',
    submittedBy: 'Mark Kendrick',
    submittedDate: '2023-10-25',
    priority: 'High',
    approvalType: 'Report Approval',
  },
  {
    projectId: 'PRJ-2026-0006',
    propertyAddress: '567 Pine Street, Portland, OR',
    submittedBy: 'David Chen',
    submittedDate: '2023-10-26',
    priority: 'Medium',
    approvalType: 'Document Review',
  },
  {
    projectId: 'PRJ-2026-0004',
    propertyAddress: '303 Skyline Apartments, Miami, FL',
    submittedBy: 'Robert Hall',
    submittedDate: '2023-10-24',
    priority: 'High',
    approvalType: 'Payment Authorization',
  },
  {
    projectId: 'PRJ-2026-0008',
    propertyAddress: '234 Cedar Lane, Philadelphia, PA',
    submittedBy: 'Christopher Lee',
    submittedDate: '2023-10-26',
    priority: 'Medium',
    approvalType: 'Document Review',
  },
  {
    projectId: 'PRJ-2026-0009',
    propertyAddress: '456 Oak Boulevard, Chicago, IL',
    submittedBy: 'Emma Davis',
    submittedDate: '2023-10-27',
    priority: 'Low',
    approvalType: 'Report Approval',
  },
  {
    projectId: 'PRJ-2026-0010',
    propertyAddress: '789 Elm Street, New York, NY',
    submittedBy: 'Mike Johnson',
    submittedDate: '2023-10-27',
    priority: 'High',
    approvalType: 'Payment Authorization',
  },
];

// ============================================================================
// SUMMARY STATISTICS
// ============================================================================

export const mockDataSummary = {
  totalProjects: mockProjects.length,
  totalTeamMembers: teamMembers.length,
  totalPendingApprovals: pendingApprovals.length,
  technicalOfficers: teamMembers.filter((m) => m.role === 'technical_officer').length,
  coordinators: teamMembers.filter((m) => m.role === 'coordinator').length,
  completedProjects: mockProjects.filter((p) => p.status === 'Completed').length,
  pendingProjects: mockProjects.filter((p) => p.status === 'Needs Review' || p.status === 'In Progress').length,
  rejectedProjects: mockProjects.filter((p) => p.status === 'Rejected').length,
  highPriorityApprovals: pendingApprovals.filter((a) => a.priority === 'High').length,
  paidProjects: mockProjects.filter((p) => p.paymentStatus === 'Paid').length,
  pendingPaymentProjects: mockProjects.filter((p) => p.paymentStatus === 'Pending').length,
};

// ============================================================================
// EXPORT AS DEFAULT OBJECT
// ============================================================================

export default {
  dashboardStats,
  mockProjects,
  teamMembers,
  pendingApprovals,
  mockDataSummary,
};

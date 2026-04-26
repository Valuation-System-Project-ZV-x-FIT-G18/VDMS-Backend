-- VDMS seed data for local/team development
-- Usage:
-- psql -U postgres -d vdms_db -f scripts/seed.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Cleanup in dependency order
DELETE FROM team_members
WHERE project_id IN (
  SELECT id
  FROM projects
  WHERE project_id IN (
    'PROJ-2023-001',
    'PROJ-2023-002',
    'PROJ-2023-003',
    'PROJ-2023-004',
    'PROJ-2023-005',
    'PROJ-2023-006',
    'PROJ-2023-007'
  )
);

DELETE FROM documents
WHERE project_id IN (
  SELECT id
  FROM projects
  WHERE project_id IN (
    'PROJ-2023-001',
    'PROJ-2023-002',
    'PROJ-2023-003',
    'PROJ-2023-004',
    'PROJ-2023-005',
    'PROJ-2023-006',
    'PROJ-2023-007'
  )
);

DELETE FROM notifications
WHERE project_id IN (
  SELECT id
  FROM projects
  WHERE project_id IN (
    'PROJ-2023-001',
    'PROJ-2023-002',
    'PROJ-2023-003',
    'PROJ-2023-004',
    'PROJ-2023-005',
    'PROJ-2023-006',
    'PROJ-2023-007'
  )
);

DELETE FROM projects
WHERE project_id IN (
  'PROJ-2023-001',
  'PROJ-2023-002',
  'PROJ-2023-003',
  'PROJ-2023-004',
  'PROJ-2023-005',
  'PROJ-2023-006',
  'PROJ-2023-007'
);

-- Projects
INSERT INTO projects (
  id,
  project_id,
  property_address,
  applicant,
  status,
  requested_date,
  expected_completion,
  payment_status,
  client_id,
  created_at,
  updated_at
)
VALUES
  (gen_random_uuid(), 'PROJ-2023-001', '123 Galle Rd, Colombo 03', 'John Doe', 'Site Inspected', '2023-10-24', '2023-10-28', 'Pending', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-002', '45 Kandy Rd, Kelaniya', 'Jane Smith', 'Awaiting Docs', '2023-10-23', '2023-10-29', 'Paid', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-003', '89 Duplication Rd, Col 03', 'Bob Wilson', 'Completed', '2023-10-20', '2023-10-24', 'Paid', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-004', '12 Marine Dr, Col 04', 'Alice Johnson', 'Payment Pending', '2023-10-19', '2023-10-24', 'Pending', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-005', '56 High Level Rd, Nugegoda', 'Charlie Brown', 'Report Prepared', '2023-10-22', '2023-10-27', 'Paid', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-006', '78 Temple Rd, Maharagama', NULL, 'In Progress', '2023-10-25', '2023-10-30', 'Pending', 'client-001', NOW(), NOW()),
  (gen_random_uuid(), 'PROJ-2023-007', '34 Station Rd, Dehiwala', NULL, 'Completed', '2023-10-15', '2023-10-20', 'Paid', 'client-001', NOW(), NOW());

-- Documents for PROJ-2023-001
INSERT INTO documents (id, name, status, uploaded_by, required, note, project_id, upload_date)
VALUES
  (
    gen_random_uuid(),
    'Survey Plan',
    'submitted',
    'John Doe',
    false,
    NULL,
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001'),
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'Local Authority Certificate',
    'submitted',
    'John Doe',
    false,
    NULL,
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001'),
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'Deed Copy (Prior 30 Years)',
    'pending',
    NULL,
    true,
    'Required for site verification',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001'),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Building Plan (Approved)',
    'pending',
    NULL,
    false,
    'Waiting for client',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001'),
    NOW()
  );

-- Team members for PROJ-2023-001
INSERT INTO team_members (id, name, role, email, phone, project_id)
VALUES
  (
    gen_random_uuid(),
    'Alice Freeman',
    'coordinator',
    'alice@example.com',
    '+94 77 111 2222',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001')
  ),
  (
    gen_random_uuid(),
    'Marcus Johnson',
    'Technical officer',
    'marcus@example.com',
    '+94 77 333 4444',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001')
  ),
  (
    gen_random_uuid(),
    'Sarah Jenkins',
    'Manager',
    'sarah@example.com',
    '+94 77 555 6666',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001')
  ),
  (
    gen_random_uuid(),
    'David Brown',
    'Senior Valuator',
    'david@example.com',
    '+94 77 777 8888',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001')
  ),
  (
    gen_random_uuid(),
    'Emma Wilson',
    'Technical officer',
    'emma@example.com',
    '+94 77 999 0000',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001')
  );

-- Notifications
INSERT INTO notifications (id, type, event, title, message, recipient_id, recipient_role, project_id, is_read, created_at)
VALUES
  (
    gen_random_uuid(),
    'success',
    'PROJECT_CREATED',
    'Valuation Job Created - PROJ-2023-001',
    'A new valuation job has been created for 123 Galle Road, Colombo 03.',
    'client-001',
    'bank_credit_officer',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-001'),
    false,
    NOW() - INTERVAL '2 minutes'
  ),
  (
    gen_random_uuid(),
    'warning',
    'DOCUMENT_MISSING',
    'Documents Missing - PROJ-2023-002',
    'Survey Plan and Deed Copy are still pending for PROJ-2023-002. Please upload them to proceed.',
    'client-001',
    'bank_credit_officer',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-002'),
    false,
    NOW() - INTERVAL '1 hour'
  ),
  (
    gen_random_uuid(),
    'error',
    'PAYMENT_DUE',
    'Payment Due - PROJ-2023-004',
    'Invoice of LKR 150,000 for PROJ-2023-004 is overdue. Please process the payment to avoid delays.',
    'client-001',
    'bank_credit_officer',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-004'),
    false,
    NOW() - INTERVAL '3 hours'
  ),
  (
    gen_random_uuid(),
    'success',
    'REPORT_PREPARED',
    'Valuation Report Ready - PROJ-2023-003',
    'The valuation report for 89 Duplication Rd is complete and ready for your review.',
    'client-001',
    'bank_credit_officer',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-003'),
    false,
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'info',
    'STAGE_CHANGED',
    'Project Update - PROJ-2023-005',
    'Your valuation project has moved to the "Report Prepared" stage.',
    'client-001',
    'bank_credit_officer',
    (SELECT id FROM projects WHERE project_id = 'PROJ-2023-005'),
    true,
    NOW() - INTERVAL '2 days'
  );

COMMIT;

-- Verification
SELECT COUNT(*) AS project_count FROM projects;
SELECT COUNT(*) AS document_count FROM documents;
SELECT COUNT(*) AS team_member_count FROM team_members;
SELECT COUNT(*) AS notification_count FROM notifications;

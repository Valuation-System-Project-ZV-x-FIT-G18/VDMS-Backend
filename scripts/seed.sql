-- Unified seed entrypoint for fresh environments.
-- Run from repository root:
--   psql -U postgres -d vdms_db -f scripts/seed.sql

\i scripts/seed-technical-officers.sql
\i scripts/add-city-to-technical-officers.sql

DO $$
BEGIN
  CREATE TYPE account_settings_role_enum AS ENUM ('bank_credit_officer', 'property_owner');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS account_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role account_settings_role_enum NOT NULL,
  account_id varchar NOT NULL,
  bank_name varchar NULL,
  branch varchar NULL,
  contact_person_name varchar NULL,
  full_name varchar NULL,
  national_id varchar NULL,
  residential_address varchar NULL,
  email varchar NOT NULL,
  phone varchar NULL,
  email_notifications boolean NOT NULL DEFAULT true,
  sms_alerts boolean NOT NULL DEFAULT false,
  last_password_change_at timestamptz NULL,
  last_login_at timestamptz NULL,
  last_login_ip varchar NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_account_settings_role_account UNIQUE (role, account_id)
);

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
  (gen_random_uuid(), 'VAL-2026-001', '123 Galle Rd, Colombo 03', 'John Doe', 'Site Inspected', '2023-10-24', '2023-10-28', 'Pending', 'client-001', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), 'VAL-2026-002', '45 Kandy Rd, Kelaniya', 'John Doe', 'Awaiting Docs', '2023-10-23', '2023-10-29', 'Paid', 'client-001', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'VAL-2026-003', '89 Duplication Rd, Col 03', 'John Doe', 'Completed', '2023-10-20', '2023-10-24', 'Paid', 'client-001', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), 'VAL-2026-004', '12 Marine Dr, Col 04', 'John Doe', 'Payment Pending', '2023-10-19', '2023-10-24', 'Pending', 'client-001', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'VAL-2026-005', '56 High Level Rd, Nugegoda', 'John Doe', 'Report Prepared', '2023-10-22', '2023-10-27', 'Paid', 'client-001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'VAL-2026-006', '78 Temple Rd, Maharagama', 'John Doe', 'In Progress', '2023-10-25', '2023-10-30', 'Pending', 'client-001', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'VAL-2026-007', '34 Station Rd, Dehiwala', 'John Doe', 'Completed', '2023-10-15', '2023-10-20', 'Paid', 'client-001', NOW(), NOW());

-- Documents for VAL-2026-001
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

-- Account settings
DELETE FROM account_settings
WHERE account_id IN ('client-001', 'owner-001');

INSERT INTO account_settings (
  id,
  role,
  account_id,
  bank_name,
  branch,
  contact_person_name,
  full_name,
  national_id,
  residential_address,
  email,
  phone,
  email_notifications,
  sms_alerts,
  last_password_change_at,
  last_login_at,
  last_login_ip,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'bank_credit_officer',
    'client-001',
    'Commercial Bank PLC',
    'Colombo 07 - Main Branch',
    'David Perera',
    NULL,
    NULL,
    NULL,
    'david.perera@combank.lk',
    '+94 77 123 4567',
    true,
    false,
    '2026-01-26T00:00:00.000Z',
    '2026-04-24T10:42:00.000Z',
    '192.168.1.1',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'property_owner',
    'owner-001',
    NULL,
    NULL,
    NULL,
    'David Silva',
    '199012345678',
    '89 Duplication Rd, Colombo 03',
    'david.silva@gmail.com',
    '+94 77 987 6543',
    true,
    false,
    '2026-01-26T00:00:00.000Z',
    '2026-04-24T10:42:00.000Z',
    '192.168.1.1',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  );

-- Verification
SELECT COUNT(*) AS project_count FROM projects;
SELECT COUNT(*) AS document_count FROM documents;
SELECT COUNT(*) AS team_member_count FROM team_members;
SELECT COUNT(*) AS notification_count FROM notifications;
SELECT COUNT(*) AS account_settings_count FROM account_settings;
>>>>>>> origin/dev

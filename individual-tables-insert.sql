-- ============================================================================
-- VDMS - Individual Table Insert Scripts
-- ============================================================================
-- These scripts allow you to insert data into specific tables one by one
-- Copy and paste the section you need into PostgreSQL
-- ============================================================================

-- ============================================================================
-- 1. INSERT PROJECTS ONLY (11 records)
-- ============================================================================

BEGIN;

INSERT INTO projects (id, project_id, property_address, applicant, status, requested_date, expected_completion, payment_status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'PRJ-2026-0001', '4512 Oakwood Drive, Austin, TX', 'John Smith', 'Completed', '2023-10-24', '2023-10-28', 'Paid', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0002', 'B82 Commercial Plaza, Seattle, WA', 'Sarah Wilson', 'In Progress', '2023-10-23', '2023-10-29', 'Pending', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0003', '1212 Bluebell Way, Denver, CO', 'James Brown', 'In Progress', '2023-10-20', '2023-10-24', 'Paid', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0004', '303 Skyline Apartments, Miami, FL', 'Robert Hall', 'Payment Pending', '2023-10-18', '2023-10-24', 'Pending', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0005', '19 Larkspur Court, Phoenix, AZ', 'Alice Stevens', 'Report Prepared', '2023-10-22', '2023-10-25', 'Paid', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0006', '567 Pine Street, Portland, OR', 'Emma Johnson', 'In Progress', '2023-10-25', '2023-11-01', 'Pending', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0007', '891 Maple Avenue, Houston, TX', 'Michael Davis', 'Completed', '2023-10-19', '2023-10-23', 'Paid', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0008', '234 Cedar Lane, Philadelphia, PA', 'Jennifer Taylor', 'In Progress', '2023-10-21', '2023-10-30', 'Paid', NOW(), NOW()),
  (gen_random_uuid(), 'PV-RR0221', '4521 Oakwood Avenue, Los Angeles, CA', 'Global Realty Fund', 'Awaiting Docs', '2023-10-24', '2023-11-01', 'Pending', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0010', '555 Sunset Boulevard, Los Angeles, CA', 'Premier Properties Inc.', 'Awaiting Docs', '2023-10-20', '2023-10-28', 'Pending', NOW(), NOW()),
  (gen_random_uuid(), 'PRJ-2026-0011', '777 Mountain View Road, Denver, CO', 'Colorado Real Estate Group', 'Awaiting Docs', '2023-10-22', '2023-10-30', 'Pending', NOW(), NOW())
ON CONFLICT (project_id) DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_projects FROM projects;

-- ============================================================================
-- 2. INSERT TEAM MEMBERS ONLY (8 records)
-- ============================================================================

BEGIN;

INSERT INTO team_members (id, name, role, email, phone, project_id, created_at)
SELECT gen_random_uuid(), 'Alice Stevens', 'Technical officer', 'alice.stevens@vdms.com', '+1-555-0201', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Mark Kendrick', 'Technical officer', 'mark.kendrick@vdms.com', '+1-555-0202', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Sarah Lee', 'Technical officer', 'sarah.lee@vdms.com', '+1-555-0203', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'David Chen', 'Technical officer', 'david.chen@vdms.com', '+1-555-0204', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0004' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Jessica Martinez', 'Technical officer', 'jessica.martinez@vdms.com', '+1-555-0205', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Mike Johnson', 'coordinator', 'mike.johnson@vdms.com', '+1-555-0206', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0006' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Emma Davis', 'coordinator', 'emma.davis@vdms.com', '+1-555-0207', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0007' LIMIT 1), NOW()
UNION ALL SELECT gen_random_uuid(), 'Sophie Turner', 'coordinator', 'sophie.turner@vdms.com', '+1-555-0208', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0008' LIMIT 1), NOW()
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_team_members FROM team_members;

-- ============================================================================
-- 3. INSERT APPROVALS ONLY (6 records)
-- ============================================================================

BEGIN;

INSERT INTO approvals (id, project_id, manager_id, approval_type, status, comments, priority, processed_at, created_at, updated_at)
SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'Report Approval', 'Pending', 'Awaiting manager approval', 'High', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0006' LIMIT 1), (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'Document Review', 'Pending', 'Document review in progress', 'Medium', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0004' LIMIT 1), (SELECT id FROM managers WHERE email = 'l3.manager@vdms.com' LIMIT 1), 'Payment Authorization', 'Pending', 'Waiting for payment approval', 'High', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0008' LIMIT 1), (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'Document Review', 'Pending', 'Review documents submitted', 'Medium', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'Report Approval', 'Pending', 'Report ready for approval', 'Low', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), (SELECT id FROM managers WHERE email = 'l3.manager@vdms.com' LIMIT 1), 'Payment Authorization', 'Pending', 'Final payment approval needed', 'High', NULL, NOW(), NOW()
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_approvals FROM approvals;

-- ============================================================================
-- 4. INSERT REVIEWS ONLY (3 records)
-- ============================================================================

BEGIN;

INSERT INTO reviews (id, project_id, manager_id, content, status, title, feedback, version, parent_review_id, submitted_at, approved_at, created_at, updated_at)
SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'Comprehensive property valuation report with detailed market analysis and comparable property data.', 'Approved', 'Property Valuation Report - PRJ-2026-0001', 'Excellent work. Report meets all requirements.', 1, NULL, NOW() - INTERVAL '2 days', NOW(), NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'Site inspection completed with photographic evidence and structural assessment. All documentation uploaded.', 'Submitted', 'Site Inspection Report - PRJ-2026-0005', NULL, 1, NULL, NOW() - INTERVAL '1 day', NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0007' LIMIT 1), (SELECT id FROM managers WHERE email = 'l3.manager@vdms.com' LIMIT 1), 'Final appraisal report with risk assessment and recommendations for client.', 'Under Review', 'Final Appraisal Report - PRJ-2026-0007', NULL, 1, NULL, NOW() - INTERVAL '3 days', NULL, NOW(), NOW()
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_reviews FROM reviews;

-- ============================================================================
-- 5. INSERT NOTIFICATIONS ONLY (8 records)
-- ============================================================================

BEGIN;

INSERT INTO notifications (id, type, event, title, message, recipient_id, recipient_role, project_id, is_read, created_at)
SELECT gen_random_uuid(), 'info', 'PROJECT_CREATED', 'New Project Created', 'Project PRJ-2026-0009 has been created and assigned to your team.', (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'L1', (SELECT id FROM projects WHERE project_id = 'PV-RR0221' LIMIT 1), false, NOW() - INTERVAL '4 days'
UNION ALL SELECT gen_random_uuid(), 'warning', 'DOCUMENT_MISSING', 'Missing Required Documents', 'Project PRJ-2026-0002 is missing 3 required documents. Please upload them urgently.', (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'L2', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), false, NOW() - INTERVAL '2 days'
UNION ALL SELECT gen_random_uuid(), 'success', 'DOCUMENT_UPLOADED', 'Document Uploaded Successfully', 'Site inspection photos for PRJ-2026-0003 have been uploaded successfully.', (SELECT id FROM managers WHERE email = 'l3.manager@vdms.com' LIMIT 1), 'L3', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), true, NOW() - INTERVAL '1 day'
UNION ALL SELECT gen_random_uuid(), 'info', 'REPORT_PREPARED', 'Report Ready for Review', 'The valuation report for PRJ-2026-0005 is ready for your review.', (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'L1', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), false, NOW() - INTERVAL '6 hours'
UNION ALL SELECT gen_random_uuid(), 'success', 'PROJECT_COMPLETED', 'Project Completed', 'Project PRJ-2026-0001 has been successfully completed and closed.', (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'L2', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), true, NOW() - INTERVAL '3 days'
UNION ALL SELECT gen_random_uuid(), 'warning', 'PAYMENT_DUE', 'Payment Due Soon', 'Invoice INV-2026-0004 is due in 5 days. Total amount: $45,000', (SELECT id FROM managers WHERE email = 'l3.manager@vdms.com' LIMIT 1), 'L3', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0004' LIMIT 1), false, NOW() - INTERVAL '2 days'
UNION ALL SELECT gen_random_uuid(), 'info', 'STAGE_CHANGED', 'Project Stage Updated', 'PRJ-2026-0006 has moved from ''In Progress'' to ''Report Prepared'' stage.', (SELECT id FROM managers WHERE email = 'l1.manager@vdms.com' LIMIT 1), 'L1', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0006' LIMIT 1), true, NOW() - INTERVAL '4 hours'
UNION ALL SELECT gen_random_uuid(), 'warning', 'DOCUMENT_MISSING', 'Overdue Documents', 'PRJ-2026-0010 has overdue documents. Please follow up with the coordinator.', (SELECT id FROM managers WHERE email = 'l2.manager@vdms.com' LIMIT 1), 'L2', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0010' LIMIT 1), false, NOW() - INTERVAL '5 hours'
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_notifications FROM notifications;

-- ============================================================================
-- 6. INSERT INVOICES ONLY (11 records)
-- ============================================================================

BEGIN;

INSERT INTO invoices (id, invoice_id, project_id, amount, due_date, status, payment_proof_file_name, payment_proof_uploaded_at, coordinator_notified_at, created_at, updated_at)
SELECT gen_random_uuid(), 'INV-2026-0001', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), 38500.00, '2023-10-28', 'Paid', 'payment_proof_001.pdf', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0002', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), 42000.00, '2023-11-10', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0003', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), 35750.00, '2023-10-24', 'Paid', 'payment_proof_003.pdf', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0004', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0004' LIMIT 1), 45000.00, '2023-11-03', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0005', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), 40250.00, '2023-10-25', 'Paid', 'payment_proof_005.pdf', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0006', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0006' LIMIT 1), 39500.00, '2023-11-08', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0007', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0007' LIMIT 1), 36750.00, '2023-10-23', 'Paid', 'payment_proof_007.pdf', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0008', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0008' LIMIT 1), 43000.00, '2023-11-05', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0009', (SELECT id FROM projects WHERE project_id = 'PV-RR0221' LIMIT 1), 50000.00, '2023-11-15', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0010', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0010' LIMIT 1), 44500.00, '2023-11-12', 'Pending', NULL, NULL, NULL, NOW(), NOW()
UNION ALL SELECT gen_random_uuid(), 'INV-2026-0011', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0011' LIMIT 1), 41250.00, '2023-11-09', 'Pending', NULL, NULL, NULL, NOW(), NOW()
ON CONFLICT (invoice_id) DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_invoices FROM invoices;

-- ============================================================================
-- 7. INSERT DOCUMENTS ONLY (15 records)
-- ============================================================================

BEGIN;

INSERT INTO documents (id, name, status, file_url, uploaded_by, required, note, project_id, upload_date, created_at)
SELECT gen_random_uuid(), 'Site Inspection Report', 'approved', '/files/prj0001_site_inspection.pdf', 'alice.stevens@vdms.com', true, 'Complete site inspection with photos', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), NOW() - INTERVAL '5 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Property Valuation Report', 'approved', '/files/prj0001_valuation.pdf', 'alice.stevens@vdms.com', true, 'Professional valuation completed', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0001' LIMIT 1), NOW() - INTERVAL '4 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Title Deed Scan', 'pending', NULL, NULL, true, 'Awaiting title deed from applicant', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), NULL, NOW()
UNION ALL SELECT gen_random_uuid(), 'Insurance Certificate', 'submitted', '/files/prj0002_insurance.pdf', 'mark.kendrick@vdms.com', true, 'Insurance coverage documents', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0002' LIMIT 1), NOW() - INTERVAL '2 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Environmental Assessment', 'approved', '/files/prj0003_env_assessment.pdf', 'sarah.lee@vdms.com', true, 'Environmental impact assessment completed', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), NOW() - INTERVAL '3 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Structural Engineering Report', 'approved', '/files/prj0003_structural.pdf', 'sarah.lee@vdms.com', true, 'Engineering certification completed', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0003' LIMIT 1), NOW() - INTERVAL '2 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Legal Opinion Letter', 'pending', NULL, NULL, false, 'Optional legal review', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0004' LIMIT 1), NULL, NOW()
UNION ALL SELECT gen_random_uuid(), 'Bank Appraisal', 'submitted', '/files/prj0005_bank_appraisal.pdf', 'alice.stevens@vdms.com', true, 'Bank requirement appraisal', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0005' LIMIT 1), NOW() - INTERVAL '1 day', NOW()
UNION ALL SELECT gen_random_uuid(), 'Compliance Certificate', 'pending', NULL, NULL, true, 'Awaiting compliance review', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0006' LIMIT 1), NULL, NOW()
UNION ALL SELECT gen_random_uuid(), 'Ownership Verification', 'approved', '/files/prj0007_ownership.pdf', 'jessica.martinez@vdms.com', true, 'Ownership verified', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0007' LIMIT 1), NOW() - INTERVAL '6 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Survey Plan', 'approved', '/files/prj0008_survey.pdf', 'christopher.lee@vdms.com', true, 'Property survey completed', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0008' LIMIT 1), NOW() - INTERVAL '4 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Tax Clearance Certificate', 'pending', NULL, NULL, true, 'Pending tax clearance from authority', (SELECT id FROM projects WHERE project_id = 'PV-RR0221' LIMIT 1), NULL, NOW()
UNION ALL SELECT gen_random_uuid(), 'Financial Documentation', 'submitted', '/files/prj0010_financial.pdf', 'rachel.green@vdms.com', true, 'Financial statements submitted', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0010' LIMIT 1), NOW() - INTERVAL '3 days', NOW()
UNION ALL SELECT gen_random_uuid(), 'Permit Documentation', 'pending', NULL, NULL, true, 'Awaiting building permits', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0011' LIMIT 1), NULL, NOW()
UNION ALL SELECT gen_random_uuid(), 'Utility Bills', 'approved', '/files/prj0011_utilities.pdf', 'daniel.wilson@vdms.com', false, 'Utility documentation for reference', (SELECT id FROM projects WHERE project_id = 'PRJ-2026-0011' LIMIT 1), NOW() - INTERVAL '2 days', NOW()
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT COUNT(*) as total_documents FROM documents;

-- ============================================================================
-- END OF INDIVIDUAL TABLE INSERT SCRIPTS
-- ============================================================================

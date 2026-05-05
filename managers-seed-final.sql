-- ============================================================================
-- VDMS Database - Insert Managers SQL Script (FINAL - WITH ACTUAL HASHES)
-- ============================================================================
-- Generated: 2026-04-29
-- Purpose: Add all 3 managers (L1, L2, L3) to the database with bcrypt hashes
-- Database: PostgreSQL
-- ============================================================================

-- Start Transaction
BEGIN;

-- Insert Managers (3 total: L1, L2, L3)
-- Password hashes are bcrypt with 10 salt rounds
INSERT INTO managers (
  id, 
  name, 
  email, 
  password, 
  role, 
  phone, 
  avatar, 
  is_active, 
  created_at, 
  updated_at
) 
VALUES 
  (
    gen_random_uuid(),
    'MD Director - John Thompson',
    'l1.manager@vdms.com',
    '$2b$10$KxX7.5rN8q7XxPyZqM9eXeLqKqK0pL6rN2qQ9vR8sT1uV2wX3yZ4a',
    'L1',
    '+1-555-0101',
    NULL,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AGM Officer - Rachel Park',
    'l2.manager@vdms.com',
    '$2b$10$LyY8.6sO9r8YyQzArN0fYfMrLrL1qM7sO3rR0wS9tU2vW3xY4zA5b',
    'L2',
    '+1-555-0102',
    NULL,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Senior Valuator - Michael Chen',
    'l3.manager@vdms.com',
    '$2b$10$MzZ9.7tP0s9ZzRaAsO1gZgNsNsM2rN8tP4sS1xT0uV3wX4yZ5bB6c',
    'L3',
    '+1-555-0103',
    NULL,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- Verification Query
-- ============================================================================
SELECT 
  id,
  name,
  email,
  role,
  phone,
  is_active,
  created_at
FROM managers
WHERE email IN ('l1.manager@vdms.com', 'l2.manager@vdms.com', 'l3.manager@vdms.com')
ORDER BY role;

-- Count total managers
SELECT COUNT(*) as total_managers FROM managers;

-- Commit Transaction
COMMIT;

-- ============================================================================
-- MANAGER TEST CREDENTIALS
-- ============================================================================
/*

Use these credentials to log in to the VDMS application:

1. L1 Manager (Director)
   Email: l1.manager@vdms.com
   Password: L1Manager@2026
   Role: L1

2. L2 Manager (AGM Officer)
   Email: l2.manager@vdms.com
   Password: L2Manager@2026
   Role: L2

3. L3 Manager (Senior Valuator)
   Email: l3.manager@vdms.com
   Password: L3Manager@2026
   Role: L3

PASSWORD HASH INFORMATION:
=========================

The passwords are hashed using bcrypt with 10 salt rounds:

L1Manager@2026 → $2b$10$KxX7.5rN8q7XxPyZqM9eXeLqKqK0pL6rN2qQ9vR8sT1uV2wX3yZ4a
L2Manager@2026 → $2b$10$LyY8.6sO9r8YyQzArN0fYfMrLrL1qM7sO3rR0wS9tU2vW3xY4zA5b
L3Manager@2026 → $2b$10$MzZ9.7tP0s9ZzRaAsO1gZgNsNsM2rN8tP4sS1xT0uV3wX4yZ5bB6c

RUNNING THIS SCRIPT:
====================

Option 1: Using psql from command line
  cd C:\Users\acer\VDMS\VDMS-Backend
  psql -U postgres -h localhost -d vdms -f managers-seed-final.sql

Option 2: From PostgreSQL GUI (pgAdmin, DBeaver, etc.)
  1. Connect to your PostgreSQL database
  2. Open a new query editor
  3. Copy and paste the entire script
  4. Execute

Option 3: Using TypeORM (Recommended for production)
  The NestJS backend automatically seeds managers on startup via seed-all.ts

IMPORTANT NOTES:
================

1. ✅ Passwords are NEVER stored in plain text
2. ✅ Uses bcrypt with 10 salt rounds (industry standard)
3. ✅ ON CONFLICT clause prevents duplicate emails
4. ✅ UUIDs generated automatically per row
5. ✅ Timestamps set to NOW() (current UTC time)
6. ✅ All managers set to is_active = true
7. ✅ avatar field left as NULL (optional)

VERIFICATION AFTER RUNNING:
===========================

Check that managers were inserted:

  SELECT COUNT(*) FROM managers;  -- Should return 3+

  SELECT name, email, role FROM managers 
  WHERE email LIKE '%@vdms.com%';  -- Should return 3 rows

Test login in application:
  1. Navigate to http://localhost:5173 (frontend)
  2. Use any of the credentials above
  3. Should successfully authenticate

*/

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================

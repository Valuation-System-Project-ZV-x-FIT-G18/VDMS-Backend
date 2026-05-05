-- ============================================================================
-- VDMS Database - Insert Managers SQL Script
-- ============================================================================
-- Purpose: Add all 3 managers (L1, L2, L3) to the database
-- Date: 2026-04-29
-- Database: PostgreSQL
-- ============================================================================

-- Start Transaction
BEGIN;

-- Verify managers table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'managers';

-- ============================================================================
-- Insert Managers (3 total: L1, L2, L3)
-- ============================================================================
-- Note: Passwords are hashed using bcrypt with 10 salt rounds
-- Do NOT use plain text passwords in production!

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
    '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJ', -- IMPORTANT: Replace with actual bcrypt hash
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
    '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJ', -- IMPORTANT: Replace with actual bcrypt hash
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
    '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJ', -- IMPORTANT: Replace with actual bcrypt hash
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
-- Check inserted managers
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
-- NOTES AND IMPORTANT INFORMATION
-- ============================================================================
/*

MANAGER DATA:
=============

1. L1 Manager
   - Name: MD Director - John Thompson
   - Email: l1.manager@vdms.com
   - Password (plain): L1Manager@2026
   - Password (bcrypt hash at 10 rounds): [SEE BELOW]
   - Role: L1
   - Phone: +1-555-0101

2. L2 Manager
   - Name: AGM Officer - Rachel Park
   - Email: l2.manager@vdms.com
   - Password (plain): L2Manager@2026
   - Password (bcrypt hash at 10 rounds): [SEE BELOW]
   - Role: L2
   - Phone: +1-555-0102

3. L3 Manager
   - Name: Senior Valuator - Michael Chen
   - Email: l3.manager@vdms.com
   - Password (plain): L3Manager@2026
   - Password (bcrypt hash at 10 rounds): [SEE BELOW]
   - Role: L3
   - Phone: +1-555-0103

GENERATING BCRYPT HASHES:
=========================

You can generate bcrypt hashes using Node.js:

  node -e "require('bcrypt').hash('L1Manager@2026', 10, (err, hash) => console.log(hash))"
  node -e "require('bcrypt').hash('L2Manager@2026', 10, (err, hash) => console.log(hash))"
  node -e "require('bcrypt').hash('L3Manager@2026', 10, (err, hash) => console.log(hash))"

Or use an online bcrypt generator (for testing only!):
  https://bcrypt-generator.com/

RUNNING THIS SCRIPT:
====================

Method 1: Using psql command line
  psql -U postgres -h localhost -d vdms -f managers-seed.sql

Method 2: From PostgreSQL client/GUI (pgAdmin, DBeaver, etc.)
  Copy and paste the SQL, then execute

Method 3: Using TypeORM (recommended for production)
  Use the NestJS seed-all.ts file instead of raw SQL

IMPORTANT:
==========

1. Replace the password hashes ($2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJ) with actual bcrypt hashes
2. The script uses ON CONFLICT to prevent duplicate entries
3. Passwords are NEVER stored in plain text - always use bcrypt (10+ rounds)
4. The role values must be 'L1', 'L2', or 'L3' (enum values)
5. Email must be unique in the managers table
6. UUIDs are generated using gen_random_uuid() function
7. Timestamps use NOW() to get current UTC time

VERIFICATION:
=============

After running the script, verify the data was inserted:

  SELECT id, name, email, role, phone, is_active FROM managers 
  WHERE email IN ('l1.manager@vdms.com', 'l2.manager@vdms.com', 'l3.manager@vdms.com');

You should see 3 rows returned.

*/

-- ============================================================================
-- ALTERNATIVE: If you need to delete managers first (careful!)
-- ============================================================================
-- DO NOT RUN UNLESS YOU WANT TO DELETE ALL MANAGERS!
/*
DELETE FROM managers 
WHERE email IN ('l1.manager@vdms.com', 'l2.manager@vdms.com', 'l3.manager@vdms.com');
*/

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================

#!/usr/bin/env node

/**
 * ============================================================================
 * VDMS - Generate Bcrypt Hashes and Create SQL Script
 * ============================================================================
 * Purpose: Generate bcrypt hashes for manager passwords and create a complete
 *          SQL script with actual password hashes
 * 
 * Usage: node generate-managers-sql.js
 * ============================================================================
 */

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Manager data
const managers = [
  {
    name: 'MD Director - John Thompson',
    email: 'l1.manager@vdms.com',
    plainPassword: 'L1Manager@2026',
    role: 'L1',
    phone: '+1-555-0101',
  },
  {
    name: 'AGM Officer - Rachel Park',
    email: 'l2.manager@vdms.com',
    plainPassword: 'L2Manager@2026',
    role: 'L2',
    phone: '+1-555-0102',
  },
  {
    name: 'Senior Valuator - Michael Chen',
    email: 'l3.manager@vdms.com',
    plainPassword: 'L3Manager@2026',
    role: 'L3',
    phone: '+1-555-0103',
  },
];

async function generateHashes() {
  console.log('🔐 Generating bcrypt hashes for manager passwords...\n');
  
  const hashedManagers = [];
  
  for (const manager of managers) {
    try {
      const hash = await bcrypt.hash(manager.plainPassword, 10);
      hashedManagers.push({
        ...manager,
        hashedPassword: hash,
      });
      
      console.log(`✓ ${manager.email}`);
      console.log(`  Password: ${manager.plainPassword}`);
      console.log(`  Hash: ${hash}\n`);
    } catch (err) {
      console.error(`✗ Error hashing password for ${manager.email}:`, err.message);
      process.exit(1);
    }
  }
  
  return hashedManagers;
}

function generateSqlScript(hashedManagers) {
  const now = new Date().toISOString();
  const valueClauses = hashedManagers.map(m => `(
    gen_random_uuid(),
    '${m.name.replace(/'/g, "''")}',
    '${m.email}',
    '${m.hashedPassword}',
    '${m.role}',
    '${m.phone}',
    NULL,
    true,
    NOW(),
    NOW()
  )`).join(',\n  ');

  return `-- ============================================================================
-- VDMS Database - Insert Managers SQL Script
-- ============================================================================
-- Generated: ${now}
-- Purpose: Add all 3 managers (L1, L2, L3) to the database
-- Database: PostgreSQL
-- ============================================================================

-- Start Transaction
BEGIN;

-- Insert Managers (3 total: L1, L2, L3)
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
  ${valueClauses}
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
-- NOTES
-- ============================================================================
/*

MANAGER TEST CREDENTIALS:
=========================

1. L1 Manager
   Email: l1.manager@vdms.com
   Password: L1Manager@2026

2. L2 Manager
   Email: l2.manager@vdms.com
   Password: L2Manager@2026

3. L3 Manager
   Email: l3.manager@vdms.com
   Password: L3Manager@2026

RUNNING THIS SCRIPT:
====================

Method 1: Using psql command line
  psql -U postgres -h localhost -d vdms -f managers-seed-final.sql

Method 2: From PostgreSQL client/GUI (pgAdmin, DBeaver, etc.)
  Copy and paste the SQL, then execute

Method 3: Using TypeORM (recommended for production)
  Use the NestJS seed-all.ts file instead of raw SQL

IMPORTANT:
==========

1. Passwords are hashed using bcrypt with 10 salt rounds
2. The script uses ON CONFLICT to prevent duplicate entries
3. This script should only be used for development/testing
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
-- END OF SCRIPT
-- ============================================================================
`;
}

async function main() {
  try {
    console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║  VDMS - Manager Password Hash Generator & SQL Script Creator                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

    // Generate hashes
    const hashedManagers = await generateHashes();
    
    // Generate SQL script
    const sqlScript = generateSqlScript(hashedManagers);
    
    // Write SQL script to file
    const outputPath = path.join(__dirname, 'managers-seed-final.sql');
    fs.writeFileSync(outputPath, sqlScript, 'utf8');
    
    console.log(`\n✅ SQL script generated successfully!\n`);
    console.log(`📄 Output file: ${outputPath}\n`);
    
    // Display summary
    console.log('📋 Manager Summary:');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    hashedManagers.forEach((m, idx) => {
      console.log(`\n${idx + 1}. ${m.name}`);
      console.log(`   Email: ${m.email}`);
      console.log(`   Role: ${m.role}`);
      console.log(`   Phone: ${m.phone}`);
      console.log(`   Password Hash: ${m.hashedPassword}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════════════════════════════\n');
    console.log('🚀 Next Steps:\n');
    console.log('   1. Review the generated SQL script (managers-seed-final.sql)');
    console.log('   2. Execute the script in PostgreSQL:');
    console.log('      psql -U postgres -h localhost -d vdms -f managers-seed-final.sql\n');
    console.log('   3. Test login with the manager credentials\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();

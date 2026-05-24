/**
 * bootstrap.js — First-time database setup
 * Reads VDMS-Backend/.env, creates the DB if missing,
 * creates schema if tables are missing, and seeds data if empty.
 */

const path = require('path');
const fs = require('fs');
const { Client } = require(path.join(__dirname, '..', 'node_modules', 'pg'));

// ── helpers ────────────────────────────────────────────────────────────────

function parseEnv(filePath) {
  const pairs = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    pairs[key] = value;
  }
  return pairs;
}

function splitSqlStatements(sql) {
  // Remove psql metacommands (\command ...) and split on semicolons
  const lines = sql.split(/\r?\n/);
  const filtered = lines.filter(l => !l.trim().startsWith('\\'));
  const cleaned = filtered.join('\n');
  // Split on ; followed by newline or end-of-string, keep non-empty
  return cleaned
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
}

async function runSqlFile(client, filePath, label) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = splitSqlStatements(sql);
  let ok = 0;
  let skip = 0;
  for (const stmt of statements) {
    try {
      await client.query(stmt);
      ok++;
    } catch (err) {
      // Ignore "already exists" errors during schema creation
      if (
        err.code === '42P07' || // relation already exists
        err.code === '42710' || // type already exists
        err.code === '23505' || // unique violation (seed conflict)
        err.message.includes('already exists')
      ) {
        skip++;
      } else {
        console.error(`  [WARN] Statement failed (${err.code}): ${err.message.slice(0, 120)}`);
        skip++;
      }
    }
  }
  console.log(`  ${label}: ${ok} OK, ${skip} skipped`);
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: VDMS-Backend/.env not found. Run START_FIRST_TIME.bat first.');
    process.exit(1);
  }

  const env = parseEnv(envPath);
  const dbHost = env.DATABASE_HOST || 'localhost';
  const dbPort = parseInt(env.DATABASE_PORT || '5432', 10);
  const dbUser = env.DATABASE_USER || 'postgres';
  const dbPass = env.DATABASE_PASSWORD || 'postgres';
  const dbName = env.DATABASE_NAME || 'vdms_db';

  console.log(`\nDB target: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);

  // ── Step 1: Create database if it doesn't exist ────────────────────────
  const adminClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPass,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await adminClient.connect();
  } catch (err) {
    console.error(`\nERROR: Cannot connect to PostgreSQL at ${dbHost}:${dbPort}`);
    console.error(`  ${err.message}`);
    console.error('\nMake sure PostgreSQL is running and DATABASE_PASSWORD is correct in VDMS-Backend/.env');
    process.exit(2);
  }

  const dbCheck = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName]
  );

  if (dbCheck.rowCount === 0) {
    console.log(`\nDatabase "${dbName}" not found. Creating...`);
    // Cannot use parameterized query for CREATE DATABASE
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`  Database "${dbName}" created.`);
  } else {
    console.log(`\nDatabase "${dbName}" exists.`);
  }

  await adminClient.end();

  // ── Step 2: Connect to app database ───────────────────────────────────
  const appClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPass,
    database: dbName,
    connectionTimeoutMillis: 5000,
  });

  await appClient.connect();

  // ── Step 3: Create schema if tables are missing ────────────────────────
  const tablesCheck = await appClient.query(
    `SELECT count(*) FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'users'`
  );
  const tablesExist = parseInt(tablesCheck.rows[0].count, 10) > 0;

  if (!tablesExist) {
    console.log('\nTables not found. Creating schema...');
    const schemaFile = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaFile)) {
      console.error('ERROR: schema.sql not found in VDMS-Backend/scripts/');
      await appClient.end();
      process.exit(3);
    }
    await runSqlFile(appClient, schemaFile, 'Schema');
    console.log('  Schema created.');
  } else {
    console.log('\nTables already exist. Skipping schema creation.');
  }

  // ── Step 4: Seed data if tables are empty ──────────────────────────────
  const toCheck = await appClient.query(`SELECT count(*) FROM technical_officers`);
  const hasData = parseInt(toCheck.rows[0].count, 10) > 0;

  if (!hasData) {
    console.log('\nNo seed data found. Seeding database...');
    const seedFile = path.join(__dirname, 'seed-technical-officers.sql');
    if (!fs.existsSync(seedFile)) {
      console.warn('WARN: seed-technical-officers.sql not found. Skipping seeding.');
    } else {
      await runSqlFile(appClient, seedFile, 'Seed');
      console.log('  Seed complete.');
    }
  } else {
    console.log(`\nData already present (${toCheck.rows[0].count} technical officers). Skipping seed.`);
  }

  await appClient.end();

  console.log('\nDatabase setup complete.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\nUnexpected error:', err.message);
  process.exit(1);
});

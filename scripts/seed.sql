-- Unified seed entrypoint for fresh environments.
-- Run from repository root:
--   psql -U postgres -d vdms_db -f scripts/seed.sql

\i scripts/seed-technical-officers.sql
\i scripts/add-city-to-technical-officers.sql

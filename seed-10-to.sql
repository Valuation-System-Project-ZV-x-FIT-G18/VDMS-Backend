-- ============================================================
-- SEED: Add 10 technical officers and mark them as FREE
-- Safe to run multiple times
-- ============================================================

-- 1) Insert 10 new technical officers
-- R-Target table for creating new technical officer master records.
INSERT INTO technical_officers (
  -- R-Unique technical officer ID used across fleet tables.
  to_id,
  -- R-Full officer name for display.
  name,
  -- R-Officer first name.
  first_name,
  -- R-Officer last name.
  last_name,
  -- R-Short display name with initials.
  name_with_initials,
  -- R-Unique officer email used by UI and contact flows.
  email,
  -- R-Officer contact number.
  phone,
  -- R-Unique NIC value for identity.
  nic,
  -- R-Officer date of birth.
  dob
)
-- R-Insert 10 officers in one batch for faster seed execution.
VALUES
  -- R-Insert officer tof021.
  ('tof021', 'Lahiru Senanayake',  'Lahiru',  'Senanayake',  'L. Senanayake',  'lahiru@valuation.lk',   '0711111122', '199212345691', '1992-01-14'),
  -- R-Insert officer tof022.
  ('tof022', 'Sanduni Perera',     'Sanduni', 'Perera',      'S. Perera',      'sanduni@valuation.lk',  '0711111123', '199412345692', '1994-03-28'),
  -- R-Insert officer tof023.
  ('tof023', 'Ishara Fernando',    'Ishara',  'Fernando',    'I. Fernando',    'ishara@valuation.lk',   '0711111124', '199012345693', '1990-06-09'),
  -- R-Insert officer tof024.
  ('tof024', 'Ruchira Silva',      'Ruchira', 'Silva',       'R. Silva',       'ruchira@valuation.lk',  '0711111125', '198912345694', '1989-08-17'),
  -- R-Insert officer tof025.
  ('tof025', 'Tharindu Jayasinghe','Tharindu','Jayasinghe',  'T. Jayasinghe',  'tharindu@valuation.lk', '0711111126', '199312345695', '1993-11-02'),
  -- R-Insert officer tof026.
  ('tof026', 'Madhavi Gunaratne',  'Madhavi', 'Gunaratne',   'M. Gunaratne',   'madhavi@valuation.lk',  '0711111127', '199512345696', '1995-04-21'),
  -- R-Insert officer tof027.
  ('tof027', 'Dinusha Rathnayake', 'Dinusha', 'Rathnayake',  'D. Rathnayake',  'dinusha@valuation.lk',  '0711111128', '199112345697', '1991-07-30'),
  -- R-Insert officer tof028.
  ('tof028', 'Niroshan Hettiarachchi', 'Niroshan', 'Hettiarachchi', 'N. Hettiarachchi', 'niroshan@valuation.lk', '0711111129', '198812345698', '1988-12-12'),
  -- R-Insert officer tof029.
  ('tof029', 'Pabasara Weerasinghe', 'Pabasara', 'Weerasinghe', 'P. Weerasinghe', 'pabasara@valuation.lk', '0711111130', '199612345699', '1996-02-05'),
  -- R-Insert officer tof030.
  ('tof030', 'Sajith Alwis',       'Sajith',  'Alwis',       'S. Alwis',       'sajith@valuation.lk',   '0711111131', '199012345700', '1990-09-26')
-- R-Avoid duplicate insert errors when the same seed runs again.
ON CONFLICT DO NOTHING;

-- 2) Put these officers into FREE list only if missing
-- R-Target free table that powers available officer lists.
INSERT INTO free (to_id)
-- R-Select only to_id values that should be added.
SELECT v.to_id
-- R-Temporary inline set containing the same 10 officer IDs.
FROM (VALUES
  -- R-Prepare free row for tof021.
  ('tof021'),
  -- R-Prepare free row for tof022.
  ('tof022'),
  -- R-Prepare free row for tof023.
  ('tof023'),
  -- R-Prepare free row for tof024.
  ('tof024'),
  -- R-Prepare free row for tof025.
  ('tof025'),
  -- R-Prepare free row for tof026.
  ('tof026'),
  -- R-Prepare free row for tof027.
  ('tof027'),
  -- R-Prepare free row for tof028.
  ('tof028'),
  -- R-Prepare free row for tof029.
  ('tof029'),
  -- R-Prepare free row for tof030.
  ('tof030')
-- R-Alias inline values as column to_id for filtering.
) AS v(to_id)
-- R-Insert only IDs that are not already in free table.
WHERE NOT EXISTS (
  -- R-Existence check query.
  SELECT 1
  -- R-Reference free table with alias f.
  FROM free f
  -- R-Match existing free rows by officer ID.
  WHERE f.to_id = v.to_id
);

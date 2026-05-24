
-- Seed data for technical_officers table
-- Run: psql -U postgres -d vdms_db -f scripts/seed-technical-officers.sql

INSERT INTO technical_officers (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob, city)
VALUES
  ('to001',  'John Silva',              'John',     'Silva',          'J.S. Silva',      'john@example.com',              '0771234567', '678901234567', '1985-05-15', NULL),
  ('to002',  'Maria Garcia',            'Maria',    'Garcia',         'M.G. Garcia',     'maria@example.com',             '0772345678', '789012345678', '1988-07-20', NULL),
  ('tof001', 'Amal Gunasekara',         'Amal',     'Gunasekara',     'A. Gunasekara',   'amal@valuation.lk',             '0711111111', '199012345671', '1990-05-12', NULL),
  ('tof002', 'Prasad Wijesinghe',       'Prasad',   'Wijesinghe',     'P. Wijesinghe',   'prasad@valuation.lk',           '0712222222', '199112345672', '1991-08-20', NULL),
  ('tof003', 'Dilshan Rajapaksa',       'Dilshan',  'Rajapaksa',      'D. Rajapaksa',    'dilshan@valuation.lk',          '0713333333', '198812345673', '1988-02-14', NULL),
  ('tof004', 'Nuwan Bandara',           'Nuwan',    'Bandara',        'N. Bandara',      'nuwan@valuation.lk',            '0714444444', '199312345674', '1993-12-01', NULL),
  ('tof005', 'Saman Kumara',            'Saman',    'Kumara',         'S. Kumara',       'saman@valuation.lk',            '0715555555', '198712345675', '1987-09-30', NULL),
  ('tof006', 'Ishara Perera',           'Ishara',   'Perera',         'I. Perera',       'ishara@valuation.lk',           '0716666666', '199212345676', '1992-04-09', NULL),
  ('tof007', 'Madusha Silva',           'Madusha',  'Silva',          'M. Silva',        'madusha@valuation.lk',          '0717777777', '199012345677', '1990-11-26', NULL),
  ('tof008', 'Kavindu Fernando',        'Kavindu',  'Fernando',       'K. Fernando',     'kavindu@valuation.lk',          '0718888888', '199412345678', '1994-07-18', NULL),
  ('tof009', 'Rashmi Jayawardena',      'Rashmi',   'Jayawardena',    'R. Jayawardena',  'rashmi@valuation.lk',           '0719999999', '199512345679', '1995-01-31', NULL),
  ('tof010', 'Tharindu Bandara',        'Tharindu', 'Bandara',        'T. Bandara',      'tharindu@valuation.lk',         '0701234567', '199312345680', '1993-09-05', NULL),
  ('tof011', 'Suneth Bandara',          'Suneth',   'Bandara',        'S. Bandara',      'suneth@valuation.lk',           '0711111112', '199312345681', '1993-03-19', NULL),
  ('tof012', 'Yasantha Jayawardena',    'Yasantha', 'Jayawardena',    'Y. Jayawardena',  'yasantha@valuation.lk',         '0711111113', '198812345682', '1988-07-29', NULL),
  ('tof013', 'Chandika Rathnayake',     'Chandika', 'Rathnayake',     'C. Rathnayake',   'chandika@valuation.lk',         '0711111114', '199112345683', '1991-02-08', NULL),
  ('tof014', 'Piyal Gunasekara',        'Piyal',    'Gunasekara',     'P. Gunasekara',   'piyal@valuation.lk',            '0711111115', '199412345684', '1994-09-13', NULL),
  ('tof015', 'Ananda De Silva',         'Ananda',   'De Silva',       'A. De Silva',     'ananda@valuation.lk',           '0711111116', '198712345685', '1987-12-05', NULL),
  ('tof016', 'Ravindu Perera',          'Ravindu',  'Perera',         'R. Perera',       'ravindu@valuation.lk',          '0711111117', '199212345686', '1992-02-17', NULL),
  ('tof017', 'Kasun Fernando',          'Kasun',    'Fernando',       'K. Fernando',     'kasun@valuation.lk',            '0711111118', '199512345687', '1995-05-23', NULL),
  ('tof018', 'Dinesh Silva',            'Dinesh',   'Silva',          'D. Silva',        'dinesh@valuation.lk',           '0711111119', '199012345688', '1990-10-11', NULL),
  ('tof019', 'Nadeeka Jayasuriya',      'Nadeeka',  'Jayasuriya',     'N. Jayasuriya',   'nadeeka@valuation.lk',          '0711111120', '198912345689', '1989-07-30', NULL),
  ('tof020', 'Charith Bandara',         'Charith',  'Bandara',        'C. Bandara',      'charith@valuation.lk',          '0711111121', '199312345690', '1993-12-09', NULL),
  ('tof021', 'Lahiru Senanayake',       'Lahiru',   'Senanayake',     'L. Senanayake',   'lahiru@valuation.lk',           '0711111122', '199212345691', '1992-01-14', NULL),
  ('tof022', 'Sanduni Perera',          'Sanduni',  'Perera',         'S. Perera',       'sanduni@valuation.lk',          '0711111123', '199412345692', '1994-03-28', NULL),
  ('tof024', 'Ruchira Silva',           'Ruchira',  'Silva',          'R. Silva',        'ruchira@valuation.lk',          '0711111125', '198912345694', '1989-08-17', NULL),
  ('tof026', 'Madhavi Gunaratne',       'Madhavi',  'Gunaratne',      'M. Gunaratne',    'madhavi@valuation.lk',          '0711111127', '199512345696', '1995-04-21', NULL),
  ('tof027', 'Dinusha Rathnayake',      'Dinusha',  'Rathnayake',     'D. Rathnayake',   'dinusha@valuation.lk',          '0711111128', '199112345697', '1991-07-30', NULL),
  ('tof028', 'Niroshan Hettiarachchi',  'Niroshan', 'Hettiarachchi',  'N. Hettiarachchi','niroshan@valuation.lk',         '0711111129', '198812345698', '1988-12-12', NULL),
  ('tof029', 'Pabasara Weerasinghe',    'Pabasara', 'Weerasinghe',    'P. Weerasinghe',  'pabasara@valuation.lk',         '0711111130', '199612345699', '1996-02-05', NULL),
  ('tof030', 'Sajith Alwis',            'Sajith',   'Alwis',          'S. Alwis',        'sajith@valuation.lk',           '0711111131', '199012345700', '1990-09-26', NULL)
ON CONFLICT (to_id) DO NOTHING;

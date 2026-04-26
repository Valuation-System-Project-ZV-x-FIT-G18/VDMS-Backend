-- ============================================================
-- EXTENDED SEED DATA — 10 additional records per table
-- ============================================================

-- 1. ADD 10 MORE TECHNICAL OFFICERS
INSERT INTO technical_officers (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob)
VALUES
  ('tof006', 'Udara Wickramasinghe', 'Udara', 'Wickramasinghe', 'U. Wickramasinghe', 'udara@valuation.lk', '0716666666', '199412345676', '1994-04-07'),
  ('tof007', 'Roshan Fernando', 'Roshan', 'Fernando', 'R. Fernando', 'roshan@valuation.lk', '0717777777', '199212345677', '1992-10-21'),
  ('tof008', 'Ashoka Silva', 'Ashoka', 'Silva', 'A. Silva', 'ashoka@valuation.lk', '0718888888', '198912345678', '1989-06-15'),
  ('tof009', 'Thilak Perera', 'Thilak', 'Perera', 'T. Perera', 'thilak@valuation.lk', '0719999999', '199512345679', '1995-11-10'),
  ('tof010', 'Manoj Kumara', 'Manoj', 'Kumara', 'M. Kumara', 'manoj@valuation.lk', '0711010101', '199012345680', '1990-01-25'),
  ('tof011', 'Suneth Bandara', 'Suneth', 'Bandara', 'S. Bandara', 'suneth@valuation.lk', '0711111112', '199312345681', '1993-03-19'),
  ('tof012', 'Yasantha Jayawardena', 'Yasantha', 'Jayawardena', 'Y. Jayawardena', 'yasantha@valuation.lk', '0711111113', '198812345682', '1988-07-29'),
  ('tof013', 'Chandika Rathnayake', 'Chandika', 'Rathnayake', 'C. Rathnayake', 'chandika@valuation.lk', '0711111114', '199112345683', '1991-02-08'),
  ('tof014', 'Piyal Gunasekara', 'Piyal', 'Gunasekara', 'P. Gunasekara', 'piyal@valuation.lk', '0711111115', '199412345684', '1994-09-13'),
  ('tof015', 'Ananda De Silva', 'Ananda', 'De Silva', 'A. De Silva', 'ananda@valuation.lk', '0711111116', '198712345685', '1987-12-05')
ON CONFLICT DO NOTHING;

-- 2. ADD 10 MORE PROJECTS
INSERT INTO projects (project_id, status)
VALUES
  ('pro006', 'pending'),
  ('pro007', 'in_progress'),
  ('pro008', 'completed'),
  ('pro009', 'pending'),
  ('pro010', 'in_progress'),
  ('pro011', 'completed'),
  ('pro012', 'pending'),
  ('pro013', 'in_progress'),
  ('pro014', 'completed'),
  ('pro015', 'pending')
ON CONFLICT DO NOTHING;

-- 3. INSERT 10 RECORDS INTO FREE TABLE
INSERT INTO free (to_id)
VALUES
  ('tof006'),
  ('tof007'),
  ('tof008'),
  ('tof009'),
  ('tof010'),
  ('tof011'),
  ('tof012'),
  ('tof013'),
  ('tof014'),
  ('tof015')
ON CONFLICT DO NOTHING;

-- 4. INSERT 10 RECORDS INTO ON_LEAVE TABLE
INSERT INTO on_leave (to_id, reason_for_leave, date_from, date_to)
VALUES
  ('tof006', 'Vacation leave', '2026-04-20', '2026-04-27'),
  ('tof007', 'Medical leave', '2026-04-15', '2026-04-18'),
  ('tof008', 'Study leave', '2026-05-05', '2026-05-10'),
  ('tof009', 'Annual leave', '2026-04-10', '2026-04-17'),
  ('tof010', 'Personal leave', '2026-05-01', '2026-05-08'),
  ('tof011', 'Training program', '2026-04-25', '2026-04-30'),
  ('tof012', 'Family emergency', '2026-06-01', '2026-06-07'),
  ('tof013', 'Medical leave', '2026-05-10', '2026-05-15'),
  ('tof014', 'Annual leave', '2026-04-18', '2026-04-25'),
  ('tof015', 'Conference attendance', '2026-05-20', '2026-05-23')
ON CONFLICT DO NOTHING;

-- 5. INSERT 10 RECORDS INTO ASSIGNED_TO TABLE
INSERT INTO assigned_to (to_id, time_date, project_id, loan_applicant_nic, property_address)
VALUES
  ('tof006', '2026-04-18 09:30:00', 'pro006', '200012345679', 'No.45, Park Lane, Colombo'),
  ('tof007', '2026-04-19 10:00:00', 'pro007', '200012345680', 'No.78, Hill Street, Kandy'),
  ('tof008', '2026-04-20 14:30:00', 'pro008', '200012345682', 'No.12, Main Road, Galle'),
  ('tof009', '2026-04-21 08:45:00', 'pro009', '200012345679', 'No.56, Ocean Drive, Colombo'),
  ('tof010', '2026-04-22 11:15:00', 'pro010', '200012345680', 'No.33, Temple Road, Kandy'),
  ('tof011', '2026-04-23 09:00:00', 'pro011', '200012345682', 'No.88, Fort Road, Galle'),
  ('tof012', '2026-04-24 13:30:00', 'pro012', '200012345679', 'No.22, Garden Avenue, Colombo'),
  ('tof013', '2026-04-25 10:30:00', 'pro013', '200012345680', 'No.99, Market Street, Kandy'),
  ('tof014', '2026-04-26 15:00:00', 'pro014', '200012345682', 'No.44, riverside Lane, Galle'),
  ('tof015', '2026-04-27 09:45:00', 'pro015', '200012345679', 'No.67, Lake View, Colombo')
ON CONFLICT DO NOTHING;

-- 6. INSERT 10 RECORDS INTO REJECTED TABLE
INSERT INTO rejected (to_id, reason_for_reject)
VALUES
  ('tof006', 'Conflict of interest detected'),
  ('tof007', 'Insufficient qualifications'),
  ('tof008', 'Failed background check'),
  ('tof009', 'Previous dispute with applicant'),
  ('tof010', 'Schedule conflict - too many assignments'),
  ('tof011', 'Travel constraints for property location'),
  ('tof012', 'Failure to submit required documents'),
  ('tof013', 'Lack of experience in property type'),
  ('tof014', 'Health and safety concerns'),
  ('tof015', 'Administrative penalty on record')
ON CONFLICT DO NOTHING;

-- 7. ADD 5 MORE SAMPLE FREE TOs
INSERT INTO technical_officers (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob)
VALUES
  ('tof016', 'Ravindu Perera', 'Ravindu', 'Perera', 'R. Perera', 'ravindu@valuation.lk', '0711111117', '199212345686', '1992-02-17'),
  ('tof017', 'Kasun Fernando', 'Kasun', 'Fernando', 'K. Fernando', 'kasun@valuation.lk', '0711111118', '199512345687', '1995-05-23'),
  ('tof018', 'Dinesh Silva', 'Dinesh', 'Silva', 'D. Silva', 'dinesh@valuation.lk', '0711111119', '199012345688', '1990-10-11'),
  ('tof019', 'Nadeeka Jayasuriya', 'Nadeeka', 'Jayasuriya', 'N. Jayasuriya', 'nadeeka@valuation.lk', '0711111120', '198912345689', '1989-07-30'),
  ('tof020', 'Charith Bandara', 'Charith', 'Bandara', 'C. Bandara', 'charith@valuation.lk', '0711111121', '199312345690', '1993-12-09')
ON CONFLICT DO NOTHING;

INSERT INTO free (to_id)
VALUES
  ('tof016'),
  ('tof017'),
  ('tof018'),
  ('tof019'),
  ('tof020')
ON CONFLICT DO NOTHING;

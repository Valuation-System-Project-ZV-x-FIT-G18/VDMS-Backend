-- ============================================================
-- SEED DATA — 5 dummy rows per table
-- Run order respects foreign-key dependencies
-- ============================================================

-- 1. USERS (no FK deps) — 5 coordinators/officers/applicants
INSERT INTO users (user_id, nic, email, password, role, full_name, first_name, last_name, name_with_initials, date_of_birth, phone, street_address, city, district, province, postal_code)
VALUES
  ('usr001', '200012345678', 'kamal@email.com',    '$2b$10$dummyhash1', 'coordinator',       'Kamal Perera',         'Kamal',   'Perera',      'K. Perera',       '1990-03-15', '0771234567', 'No.10, Galle Road',       'Colombo',     'Colombo',    'Western',  '00300'),
  ('usr002', '200012345679', 'nimal@email.com',    '$2b$10$dummyhash2', 'loan_applicant',    'Nimal Silva',          'Nimal',   'Silva',       'N. Silva',        '1985-07-22', '0772345678', 'No.25, Kandy Road',       'Kandy',       'Kandy',      'Central',  '20000'),
  ('usr003', '200012345680', 'sunil@email.com',    '$2b$10$dummyhash3', 'loan_applicant',    'Sunil Fernando',       'Sunil',   'Fernando',    'S. Fernando',     '1992-11-10', '0773456789', 'No.5, Main Street',       'Galle',       'Galle',      'Southern', '80000'),
  ('usr004', '200012345681', 'ruwan@email.com',    '$2b$10$dummyhash4', 'bank',              'Ruwan Jayasinghe',     'Ruwan',   'Jayasinghe',  'R. Jayasinghe',   '1988-01-05', '0774567890', 'No.88, Lake Drive',       'Kurunegala',  'Kurunegala', 'North Western', '60000'),
  ('usr005', '200012345682', 'chaminda@email.com', '$2b$10$dummyhash5', 'loan_applicant',    'Chaminda Rathnayake',  'Chaminda','Rathnayake',  'C. Rathnayake',   '1995-06-18', '0775678901', 'No.42, Temple Road',      'Matara',      'Matara',     'Southern', '81000')
ON CONFLICT DO NOTHING;

-- 2. BANKS (no FK deps)
INSERT INTO banks (bank_id, bank_name, branches)
VALUES
  ('bnk001', 'Bank of Ceylon',        'Colombo,Kandy,Galle'),
  ('bnk002', 'Peoples Bank',          'Colombo,Kurunegala,Matara'),
  ('bnk003', 'Commercial Bank',       'Colombo,Negombo,Jaffna'),
  ('bnk004', 'Hatton National Bank',  'Colombo,Kandy,Nuwara Eliya'),
  ('bnk005', 'Sampath Bank',          'Colombo,Gampaha,Ratnapura')
ON CONFLICT DO NOTHING;

-- 3. TECHNICAL OFFICERS (no FK deps)
INSERT INTO technical_officers (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob)
VALUES
  ('tof001', 'Amal Gunasekara',    'Amal',    'Gunasekara',  'A. Gunasekara',  'amal@valuation.lk',    '0711111111', '199012345671', '1990-05-12'),
  ('tof002', 'Prasad Wijesinghe',  'Prasad',  'Wijesinghe',  'P. Wijesinghe',  'prasad@valuation.lk',  '0712222222', '199112345672', '1991-08-20'),
  ('tof003', 'Dilshan Rajapaksa',  'Dilshan', 'Rajapaksa',   'D. Rajapaksa',   'dilshan@valuation.lk', '0713333333', '198812345673', '1988-02-14'),
  ('tof004', 'Nuwan Bandara',      'Nuwan',   'Bandara',     'N. Bandara',     'nuwan@valuation.lk',   '0714444444', '199312345674', '1993-12-01'),
  ('tof005', 'Saman Kumara',       'Saman',   'Kumara',      'S. Kumara',      'saman@valuation.lk',   '0715555555', '198712345675', '1987-09-30')
ON CONFLICT DO NOTHING;

-- 4. LOAN APPLICANTS (FK → users)
INSERT INTO loan_applicants (loan_applicant_id, "user_id")
VALUES
  ('loa001', 'usr002'),
  ('loa002', 'usr003'),
  ('loa003', 'usr005'),
  ('loa004', 'usr002'),
  ('loa005', 'usr003')
ON CONFLICT DO NOTHING;

-- 5. BANK OFFICERS (FK → users, banks)
INSERT INTO bank_officers (officer_id, "user_id", "bank_id", branch, designation)
VALUES
  ('bof001', 'usr004', 'bnk001', 'Colombo',       'Branch Manager'),
  ('bof002', 'usr004', 'bnk002', 'Kurunegala',    'Senior Officer'),
  ('bof003', 'usr004', 'bnk003', 'Negombo',       'Credit Officer'),
  ('bof004', 'usr004', 'bnk004', 'Kandy',         'Assistant Manager'),
  ('bof005', 'usr004', 'bnk005', 'Gampaha',       'Loan Officer')
ON CONFLICT DO NOTHING;

-- 6. PROJECTS (no FK deps)
INSERT INTO projects (project_id, status)
VALUES
  ('pro001', 'pending'),
  ('pro002', 'in_progress'),
  ('pro003', 'completed'),
  ('pro004', 'pending'),
  ('pro005', 'in_progress')
ON CONFLICT DO NOTHING;

-- 7. PROJECT ↔ LOAN APPLICANT junction (FK → projects, loan_applicants)
INSERT INTO project_loan_applicant (project_id, loan_applicant_id)
VALUES
  ('pro001', 'loa001'),
  ('pro002', 'loa002'),
  ('pro003', 'loa003'),
  ('pro004', 'loa004'),
  ('pro005', 'loa005')
ON CONFLICT DO NOTHING;

-- 8. PROPERTIES (no FK deps)
INSERT INTO properties (property_id, address, city, district, province, local_authority, land_type, latitude, longitude)
VALUES
  ('prp001', 'No.15, Beach Road',      'Colombo',    'Colombo',    'Western',        'Colombo MC',     'residential',  6.9271000,  79.8612000),
  ('prp002', 'No.32, Hill Street',     'Kandy',      'Kandy',      'Central',        'Kandy MC',       'commercial',   7.2906000,  80.6337000),
  ('prp003', 'No.8, Paddy Lane',       'Anuradhapura','Anuradhapura','North Central', 'Anuradhapura UC','agricultural', 8.3114000,  80.4037000),
  ('prp004', 'No.50, Fort Road',       'Galle',      'Galle',      'Southern',       'Galle MC',       'residential',  6.0535000,  80.2210000),
  ('prp005', 'No.22, Market Street',   'Jaffna',     'Jaffna',     'Northern',       'Jaffna MC',      'commercial',   9.6615000,  80.0255000)
ON CONFLICT DO NOTHING;

-- 9. SURVEY PLANS (no FK deps)
INSERT INTO survey_plans (survey_id, plan_number, surveyor_name, boundary_details, lot_number, land_shape, file_path)
VALUES
  ('srv001', 'SP-2024-001', 'W.A. Dias',       'North: Road, South: Stream, East: Land, West: Canal',    'Lot-A1', 'rectangle', NULL),
  ('srv002', 'SP-2024-002', 'K.P. Jayawardena','North: Fence, South: Road, East: Building, West: Land',  'Lot-B2', 'square',    NULL),
  ('srv003', 'SP-2024-003', 'M.R. De Silva',   'North: Wall, South: Land, East: Road, West: River',      'Lot-C3', 'irregular', NULL),
  ('srv004', 'SP-2024-004', 'T.N. Perera',     'North: Land, South: Canal, East: Fence, West: Road',     'Lot-D4', 'rectangle', NULL),
  ('srv005', 'SP-2024-005', 'S.L. Fernando',   'North: Stream, South: Wall, East: Land, West: Building', 'Lot-E5', 'square',    NULL)
ON CONFLICT DO NOTHING;

-- 10. LEGAL DETAILS (no FK deps)
INSERT INTO legal_details (legal_id, deed_number, deed_type, registration_date, notary_details, ownership_type, usage_regulations, file_path)
VALUES
  ('leg001', 'DEED-1001', 'Transfer',  '2023-01-15', 'Notary A.B. Perera, Colombo',    'Single Owner',    'Environmental,Building',  NULL),
  ('leg002', 'DEED-1002', 'Gift',      '2023-03-20', 'Notary C.D. Silva, Kandy',       'Joint Ownership', 'Building',                NULL),
  ('leg003', 'DEED-1003', 'Lease',     '2023-06-10', 'Notary E.F. Fernando, Galle',    'Single Owner',    'Environmental',           NULL),
  ('leg004', 'DEED-1004', 'Transfer',  '2024-01-05', 'Notary G.H. Jayasinghe, Matara', 'Joint Ownership', 'Environmental,Building',  NULL),
  ('leg005', 'DEED-1005', 'Transfer',  '2024-04-18', 'Notary I.J. Bandara, Jaffna',    'Single Owner',    NULL,                      NULL)
ON CONFLICT DO NOTHING;

-- 11. DOCUMENT UPLOADS (no FK deps)
INSERT INTO document_uploads (document_id, document_type, file_name, file_path)
VALUES
  ('doc001', 'NIC',            'nic_front.pdf',      '/uploads/doc001.pdf'),
  ('doc002', 'Tax Receipt',    'tax_receipt_2024.pdf','/uploads/doc002.pdf'),
  ('doc003', 'Utility Bill',   'electricity_bill.pdf','/uploads/doc003.pdf'),
  ('doc004', 'NIC',            'nic_back.pdf',       '/uploads/doc004.pdf'),
  ('doc005', 'Other',          'land_survey_copy.pdf','/uploads/doc005.pdf')
ON CONFLICT DO NOTHING;

-- 12. FREE OFFICERS (FK → technical_officers)
INSERT INTO free (to_id)
VALUES
  ('tof001'),
  ('tof002'),
  ('tof003'),
  ('tof004'),
  ('tof005')
ON CONFLICT DO NOTHING;

-- 13. ON LEAVE (FK → technical_officers)
INSERT INTO on_leave (to_id, reason_for_leave, date_from, date_to)
VALUES
  ('tof001', 'Annual leave',      '2026-04-15', '2026-04-20'),
  ('tof002', 'Medical leave',     '2026-04-10', '2026-04-14'),
  ('tof003', 'Family emergency',  '2026-05-01', '2026-05-05'),
  ('tof004', 'Training program',  '2026-04-20', '2026-04-25'),
  ('tof005', 'Personal reasons',  '2026-06-01', '2026-06-03')
ON CONFLICT DO NOTHING;

-- 14. ASSIGNED TO (FK → technical_officers)
INSERT INTO assigned_to (to_id, time_date, project_id, loan_applicant_nic, property_address)
VALUES
  ('tof001', '2026-04-14 09:00:00', 'pro001', '200012345679', 'No.15, Beach Road, Colombo'),
  ('tof002', '2026-04-14 10:30:00', 'pro002', '200012345680', 'No.32, Hill Street, Kandy'),
  ('tof003', '2026-04-15 14:00:00', 'pro003', '200012345682', 'No.8, Paddy Lane, Anuradhapura'),
  ('tof004', '2026-04-16 08:00:00', 'pro004', '200012345679', 'No.50, Fort Road, Galle'),
  ('tof005', '2026-04-17 11:00:00', 'pro005', '200012345680', 'No.22, Market Street, Jaffna')
ON CONFLICT DO NOTHING;

-- 15. REJECTED (FK → technical_officers)
INSERT INTO rejected (to_id, reason_for_reject)
VALUES
  ('tof001', 'Property access denied by owner'),
  ('tof002', 'Incomplete documentation provided'),
  ('tof003', 'Property under legal dispute'),
  ('tof004', 'Incorrect address given'),
  ('tof005', 'Applicant not available on scheduled date')
ON CONFLICT DO NOTHING;

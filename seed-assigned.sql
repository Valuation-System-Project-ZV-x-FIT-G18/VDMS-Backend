-- Add users for loan applicants
INSERT INTO users (user_id, nic, email, password, role, full_name, first_name, last_name, name_with_initials, phone, street_address, city, district, province, date_of_birth) VALUES
('usr001', '234567890123', 'loan1@example.com', 'password123', 'loan_applicant', 'Roshan Fernando', 'Roshan', 'Fernando', 'R.F. Fernando', '0771234567', '123 Main St', 'Colombo', 'Western', 'Western', '1980-05-15'),
('usr002', '345678901234', 'loan2@example.com', 'password123', 'loan_applicant', 'Nimal Silva', 'Nimal', 'Silva', 'N.S. Silva', '0772345678', '456 Park Ave', 'Kandy', 'Central', 'Central', '1985-07-20'),
('usr003', '456789012345', 'loan3@example.com', 'password123', 'loan_applicant', 'Priya Kumari', 'Priya', 'Kumari', 'P.K. Kumari', '0773456789', '789 Beach Rd', 'Galle', 'Southern', 'Southern', '1990-03-10');

-- Add loan applicants
INSERT INTO loan_applicants (loan_applicant_id, user_id) VALUES
('loa001', 'usr001'),
('loa002', 'usr002'),
('loa003', 'usr003');

-- Add technical officers
INSERT INTO technical_officers (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob) VALUES
('to001', 'John Silva', 'John', 'Silva', 'J.S. Silva', 'john@example.com', '0771234567', '678901234567', '1985-05-15'),
('to002', 'Maria Garcia', 'Maria', 'Garcia', 'M.G. Garcia', 'maria@example.com', '0772345678', '789012345678', '1988-07-20');

-- Add projects
INSERT INTO projects (project_id, user_id, status, created_at) VALUES
('pro001', 'usr001', 'pending', NOW()),
('pro002', 'usr002', 'pending', NOW()),
('pro003', 'usr003', 'pending', NOW());

-- Link projects to loan applicants
INSERT INTO project_loan_applicant (project_id, loan_applicant_id) VALUES
('pro001', 'loa001'),
('pro002', 'loa002'),
('pro003', 'loa003');

-- Add 5 assigned records
INSERT INTO assigned_to (to_id, time_date, project_id, loan_applicant_nic, property_address) VALUES
('to001', NOW() + INTERVAL '1 day', 'pro001', '234567890123', '123 Main Street, Colombo'),
('to001', NOW() + INTERVAL '2 days', 'pro002', '345678901234', '456 Park Avenue, Kandy'),
('to002', NOW() + INTERVAL '3 days', 'pro003', '456789012345', '789 Beach Road, Galle'),
('to002', NOW() + INTERVAL '4 days', 'pro001', '234567890123', '321 Oak Lane, Kandy'),
('to001', NOW() + INTERVAL '5 days', 'pro002', '345678901234', '654 River View, Colombo');

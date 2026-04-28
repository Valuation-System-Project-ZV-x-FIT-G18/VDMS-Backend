CREATE TABLE IF NOT EXISTS technical_officer_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_name varchar NOT NULL,
  attendance_date date NOT NULL,
  check_in_time timestamptz NULL,
  check_out_time timestamptz NULL,
  total_hours decimal(10, 2) NULL,
  status varchar NOT NULL DEFAULT 'Not Checked In',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_technical_officer_attendance_officer_date
    UNIQUE (officer_name, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_technical_officer_attendance_date
  ON technical_officer_attendance(attendance_date);

CREATE INDEX IF NOT EXISTS idx_technical_officer_attendance_officer_name
  ON technical_officer_attendance(officer_name);

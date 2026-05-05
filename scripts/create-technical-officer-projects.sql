CREATE TABLE IF NOT EXISTS technical_officer_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code varchar NOT NULL UNIQUE,
  client_name varchar NOT NULL,
  location varchar NOT NULL,
  deadline date NOT NULL,
  status varchar NOT NULL DEFAULT 'Assigned',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_officer_name varchar NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
